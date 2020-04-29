import DailyReport from "./dailyReport.model";
import Branch from "../Branches/branch.model";
import Job from "./job.model";
import { getRangeFromDate } from "../utils/dates";
import { isHamal, getBranchIdentifier } from "../utils/users";

const LOWER_LEVEL_DICTIONARY: Record<string, (branch: be.BranchHierarchy | be.Branch) => string> = {
    "national": branch => branch.district,
    "district": branch => branch.napa,
    "napa": branch => branch.municipality,
    "municipality": branch => branch.name
}

const BRANCH_FILTER_DICTIONARY: Record<string, any> = {
    "national": () => { },
    "district": district => ({ district: { $eq: district } }),
    "napa": napa => ({ napa: { $eq: napa } }),
    "municipality": municipality => ({ municipality: { $eq: municipality } })
}

export async function createFutureReports(req, res) {
    if (!isHamal(req.user)) res.status(403).send("אינך מורשה");

    const { reports } = req.body;
    const { deliveryType } = req.query;

    if (!deliveryType) return res.status(400).send("חובה לציין סוג משלוח");

    const date = new Date(req.body.date);

    const error = _isValid(reports);
    if (error) return res.status(400).send(error);

    const branches = await Branch.find();
    const existingBranchIds = new Set(branches.map(_ => _.id))
    const newBranches = reports.filter(report => !existingBranchIds.has(report.id));

    const { start, end } = getRangeFromDate(date);
    const dateRange = { $gte: start, $lt: end };
    const dbDailyReports = await DailyReport.find({ date: dateRange });

    const existingReports = new Set();

    // update exist reports
    await Promise.all(dbDailyReports.map(report => {
        const newReport = reports.find(_ => _.id === report.branchId);
        if (!newReport) return null;

        existingReports.add(report.branchId);

        const oldDeliveryInfo = report.deliveries.get(deliveryType) || {} as any;
        if (oldDeliveryInfo.total === newReport.amount) return null;

        return DailyReport.findOneAndUpdate({ _id: report._id }, { [`deliveries.${deliveryType}`]: { total: newReport.amount } });
    }).filter(Boolean));

    const newReports = reports.filter(report => !existingReports.has(report.id));

    // add new branches
    await Branch.insertMany(newBranches);
    // add new reports
    await DailyReport.insertMany(newReports.map(({ id, amount }) => ({
        branchId: id,
        date,
        deliveries: { [deliveryType]: { total: amount } }
    })));

    res.status(201).json("הועלה בהצלחה");
}

function _isValid(reports: be.FutureReport[]) {
    for (let i = 0; i < reports.length; i++) {
        const report = reports[i];

        if (!report) return `אחד הדיווחים ריק`;

        const { id, name, municipality, napa, district, amount } = report;

        if (isNaN(id)) return `באחד הדיווחים המזהה נקודת החלוקה אינו מספר`;
        if (_isEmptyString(name)) return `מרכז חלוקה ${id}: שם נקודת החלוקה אינו תקין`;
        if (_isEmptyString(municipality)) return `מרכז חלוקה ${id}: שם הרשות אינו תקין`;
        if (_isEmptyString(napa)) return `מרכז חלוקה ${id}: הנפה שהוזנה אינה תקין`;
        if (_isEmptyString(district)) return `מרכז חלוקה ${id}: המחוז שהוזן  אינו תקין`;
        if (isNaN(amount)) return `מרכז חלוקה ${id}: כמות האזרחים לחלוקה אינה תקינה`;
    }

    return null;
}

function _isEmptyString(value: string) { return value.trim() === ""; }

export async function getRelevantBranches(req, res) {
    const { date } = req.params;
    const { level, value } = req.query;
    const { start, end } = getRangeFromDate(new Date(date));

    const reports = await DailyReport.find({
        date: { $gte: start, $lt: end }
    });

    const relevantReports = reports.filter(_ => _.deliveries &&
        Array.from(_.deliveries.keys()).some(key => _.deliveries.get(key).total > 0));

    const branches = await Branch.find({
        id: { $in: relevantReports.map(_ => _.branchId) }
    });

    if ((level as be.Level) === "national") res.json(branches);

    else res.json(branches.filter(branch => branch[level] === value));
}

export async function getRelevantDeliveryTypes(req, res) {
    const { date } = req.params;
    const { start, end } = getRangeFromDate(new Date(date));

    const reports = await DailyReport.find({ date: { $gte: start, $lt: end } }, "deliveries");

    const result = new Set<string>();
    reports.map(_ => Array.from(_.deliveries.keys())).forEach(keys => keys.forEach(x => result.add(x)));

    res.status(200).json(Array.from(result.values()));
}

export async function getDailyReport(req, res) {
    const { date, level, value, hideEmpty } = req.query;

    if (!isHamal(req.user)) res.status(403).send("אינך מורשה לצפות במידע");

    if (!level || !LOWER_LEVEL_DICTIONARY[level]) return res.status(400).send("רמת ההסתכלות אינה תקינה");

    const branches = (await Branch.find(BRANCH_FILTER_DICTIONARY[level](value))).map(_ => _.toJSON());

    const { start, end } = getRangeFromDate(new Date(date));
    const dateRange = { $gte: start, $lt: end };

    const reports = await DailyReport.find({
        date: dateRange,
        branchId: { $in: branches.map(_ => _.id) },
    });

    const jobs = await Job.find({
        city: { $in: [...new Set(branches.map(_ => _.municipality))] },
        date: dateRange
    });

    res.status(200).json(_groupBySubLevels(level, branches, reports, jobs, hideEmpty === "true"));
}

function _groupBySubLevels(level: be.Level, branches: be.Branch[], reports: be.DBDailyReport[], jobs: gg.Job[], hideEmpty: boolean): be.DailyReport[] {
    const branchDictionary: Record<number, be.Branch> = branches.reduce((pv, v) => ({ ...pv, [v.id]: v }), {});
    const hierarchyCache: Record<string, be.BranchHierarchy> = {};

    const lowerLevelDisplayName = LOWER_LEVEL_DICTIONARY[level];

    const jobTotals: Record<string, be.DailyReport> = {};

    for (const { city, distributionPoint, status, tasks } of jobs) {
        if (status === "CANCELED") continue;

        const branchId = getBranchIdentifier({ name: distributionPoint, municipality: city });

        if (!hierarchyCache[branchId]) {
            const branch = branches.find(_ => _.municipality === city);
            hierarchyCache[branchId] = { identifier: branchId, name: distributionPoint, municipality: city };

            if (branch) {
                hierarchyCache[branchId].napa = branch.napa;
                hierarchyCache[branchId].district = branch.district;
            }
        }

        const displayName = lowerLevelDisplayName(hierarchyCache[branchId]);

        if (!displayName) continue;

        if (!jobTotals[displayName]) jobTotals[displayName] = {
            name: displayName,
            hasExternalInfo: true,
            deliveries: {}
        };

        const { deliveries } = jobTotals[displayName];

        for (const { status: taskStatus, failureReason, needType } of tasks) {
            const deliveryTypes = _parseNeedType(needType);

            for (const deliveryType of deliveryTypes) {
                if (!deliveries[deliveryType]) deliveries[deliveryType] = _getEmptyDelivery();

                deliveries[deliveryType].actual += 1;
                switch (taskStatus) {
                    // delivered
                    case "DELIVERED":
                        deliveries[deliveryType].delivered += 1;
                        break;
                    case "UNDELIVERED":
                        deliveries[deliveryType].deliveryInProgress += 1;
                        break;
                    // deliveryFailed
                    case "FAILED":
                        deliveries[deliveryType].deliveryFailed += 1;
                        const field = ["DECLINED", "UNREACHABLE", "ADDRESS"].includes(failureReason) ? failureReason.toLowerCase() : "other";
                        deliveries[deliveryType].deliveryFailReasons[field] += 1;
                        break;
                }
            }
        }
    }

    const reportTotals: be.DailyReport[] = reports.map(({ branchId, deliveries }) => ({
        name: lowerLevelDisplayName(branchDictionary[branchId]),
        address: level === "municipality" ? branchDictionary[branchId].address : undefined,
        deliveries: Array.from(deliveries.entries()).filter(([key, value]) => value?.total > 0)
            .reduce((pv, [type, { total, delivered, deliveryFailed, deliveryFailReasons }]) => ({
                ...pv,
                [type]: {
                    expected: total,
                    actual: delivered + deliveryFailed,
                    delivered,
                    deliveryFailed,
                    deliveryInProgress: 0,
                    deliveryFailReasons: {
                        declined: deliveryFailReasons.get("declined") ?? 0,
                        address: deliveryFailReasons.get("address") ?? 0,
                        unreachable: deliveryFailReasons.get("unreachable") ?? 0,
                        other: deliveryFailReasons.get("other") ?? 0
                    }
                }
            }), {})
    }))

    let result = [
        ...Object.values(jobTotals).filter(_ => Object.keys(_.deliveries).length > 0),
        ...reportTotals.filter(_ => Object.keys(_.deliveries).length > 0)
    ];

    if (level !== "municipality")
        // combine daily reports by display name (not for distibution centers)
        result = Object.values(result.reduce((pv, v) => ({
            ...pv,
            [v.name]: _mergeReports(pv[v.name], v)
        }), {} as Record<string, be.DailyReport>));

    return !hideEmpty ? result : result.filter(_ => Object.values(_.deliveries).some(d => d.actual > 0));
}

function _parseNeedType(needType: gg.NeedType): be.DeliveryType[] {
    switch (needType) {
        case "FOOD":
        case "FOOD_FLOWER":
        case "MEAL": return ["food_hot"];
        case "FOOD_PARCEL": return ["food_cold"];
        case "FOOD_PARCEL_MEAL": return ["food_hot", "food_cold"];
        default: return [];
    }
}

function _getEmptyDelivery(): be.DeliveryInfo {
    return {
        expected: 0,
        actual: 0,
        delivered: 0,
        deliveryFailed: 0,
        deliveryInProgress: 0,
        deliveryFailReasons: { declined: 0, address: 0, unreachable: 0, other: 0 }
    };
}

function _mergeReports(prev: be.DailyReport | undefined, curr: be.DailyReport): be.DailyReport {
    if (!prev) return curr;

    return {
        name: prev.name,
        hasExternalInfo: prev.hasExternalInfo || curr.hasExternalInfo,
        deliveries: _mergeDeliveries(prev.deliveries, curr.deliveries)
    };
}

function _mergeDeliveries(prev: Record<be.DeliveryType, be.DeliveryInfo>, curr: Record<be.DeliveryType, be.DeliveryInfo>): Record<be.DeliveryType, be.DeliveryInfo> {
    const deliveryTypes = new Set([...Object.keys(prev), ...Object.keys(curr)]);

    return Array.from(deliveryTypes.values()).reduce((pv, key) => {
        if (!prev[key]) pv[key] = curr[key];
        else if (!curr[key]) pv[key] = prev[key];
        else pv[key] = {
            expected: prev[key].expected + curr[key].expected,
            actual: prev[key].actual + curr[key].actual,
            delivered: prev[key].delivered + curr[key].delivered,
            deliveryFailed: prev[key].deliveryFailed + curr[key].deliveryFailed,
            deliveryInProgress: prev[key].deliveryInProgress + curr[key].deliveryInProgress,
            deliveryFailReasons: {
                declined: prev[key].deliveryFailReasons.declined + curr[key].deliveryFailReasons.declined,
                address: prev[key].deliveryFailReasons.address + curr[key].deliveryFailReasons.address,
                unreachable: prev[key].deliveryFailReasons.unreachable + curr[key].deliveryFailReasons.unreachable,
                other: prev[key].deliveryFailReasons.other + curr[key].deliveryFailReasons.other
            }
        };

        return pv;
    }, {});
}
