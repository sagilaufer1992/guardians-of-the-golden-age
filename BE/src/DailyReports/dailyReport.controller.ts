import DailyReport from "./dailyReport.model";
import Branch from "../Branches/branch.model";
import Job from "./job.model";
import { getRangeFromDate } from "../utils/dates";
import { isHamal, getBranchIdentifier } from "../utils/users";

const LOWER_LEVEL_DICTIONARY: Record<string, (branch: be.BranchHierarchy) => string> = {
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
    dbDailyReports.forEach(async report => {
        const newReport = reports.find(_ => _.id === report.branchId);
        if (!newReport) return;

        existingReports.add(report.branchId);
        report.total = newReport.amount;
        await report.save();
    });

    const newReports = reports.filter(report => !existingReports.has(report.id));

    // add new branches
    await Branch.create(newBranches);
    // add new reports
    await DailyReport.create(newReports.map(({ id, amount }) => ({ branchId: id, date, total: amount })));

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
        if (isNaN(amount)) return `מרכז חלוקה ${id}: כמות האזרחים אינה תקינה`;
    }

    return null;
}

function _isEmptyString(value: string) { return value.trim() === ""; }

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

type ReportWithHierarchy = Omit<be.DailyReport, "name"> & { hierarchy: be.BranchHierarchy };

function _groupBySubLevels(level: be.Level, branches: be.Branch[], reports: be.DBDailyReport[], jobs: gg.Job[], hideEmpty: boolean): be.DailyReport[] {
    const branchDictionary: Record<number, be.Branch> = branches.reduce((pv, v) => ({ ...pv, [v.id]: v }), {});

    const hierarchyCache: Record<string, be.BranchHierarchy> = {};

    const lowerLevelDisplayName = LOWER_LEVEL_DICTIONARY[level];

    const totals: Record<string, ReportWithHierarchy> = {};

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

        if (!totals[branchId]) totals[branchId] = {
            hierarchy: hierarchyCache[branchId],
            hasExternalInfo: true,
            expected: 0,
            actual: 0,
            delivered: 0,
            deliveryFailed: 0,
            deliveryInProgress: 0,
            deliveryFailReasons: { declined: 0, address: 0, unreachable: 0, other: 0 }
        };

        for (const { status: taskStatus, failureReason } of tasks) {
            totals[branchId].actual += 1;
            switch (taskStatus) {
                // delivered
                case "DELIVERED":
                    totals[branchId].delivered += 1;
                    break;
                case "UNDELIVERED":
                    totals[branchId].deliveryInProgress += 1;
                    break;
                // deliveryFailed
                case "FAILED":
                    totals[branchId].deliveryFailed += 1;
                    const field = ["DECLINED", "UNREACHABLE", "ADDRESS"].includes(failureReason) ? failureReason.toLowerCase() : "other";
                    totals[branchId].deliveryFailReasons[field] += 1;
                    break;
            }
        }
    }

    for (const { branchId, total, delivered, deliveryFailed, deliveryFailReasons } of reports) {
        const id = getBranchIdentifier(branchDictionary[branchId]);

        if (totals[id]) totals[id].expected = total;
        else totals[id] = {
            hierarchy: { identifier: id, ...branchDictionary[branchId] },
            expected: total,
            actual: delivered + deliveryFailed,
            delivered,
            deliveryFailed,
            deliveryInProgress: 0,
            deliveryFailReasons: {
                declined: (deliveryFailReasons as any).get("declined") ?? 0,
                address: (deliveryFailReasons as any).get("address") ?? 0,
                unreachable: (deliveryFailReasons as any).get("unreachable") ?? 0,
                other: (deliveryFailReasons as any).get("other") ?? 0
            }
        };
    }

    let result: be.DailyReport[] = Object.values(Object.values(totals).reduce((pv, report) => {
        const name = lowerLevelDisplayName(report.hierarchy);
        if (!name) return pv;

        const acc = pv[name];
        const result = _mergeAndFilterResults(name, acc, report);

        return { ...pv, [name]: result };
    }, {}));

    if (hideEmpty) result = result.filter(_ => _.actual > 0);

    return result;
}

function _mergeAndFilterResults(name: string, acc: be.DailyReport, report: ReportWithHierarchy): be.DailyReport {
    if (!acc) {
        const { hierarchy, ...other } = report;
        return { ...other, name };
    }

    return {
        name,
        hasExternalInfo: acc.hasExternalInfo || report.hasExternalInfo,
        expected: acc.expected + report.expected,
        actual: acc.actual + report.actual,
        delivered: acc.delivered + report.delivered,
        deliveryFailed: acc.deliveryFailed + report.deliveryFailed,
        deliveryInProgress: acc.deliveryInProgress + report.deliveryInProgress,
        deliveryFailReasons: {
            declined: acc.deliveryFailReasons.declined + report.deliveryFailReasons.declined,
            address: acc.deliveryFailReasons.address + report.deliveryFailReasons.address,
            unreachable: acc.deliveryFailReasons.unreachable + report.deliveryFailReasons.unreachable,
            other: acc.deliveryFailReasons.other + report.deliveryFailReasons.other
        }
    };
}