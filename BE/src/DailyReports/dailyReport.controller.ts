import DailyReport from "./dailyReport.model";
import Branch from "../Branches/branch.model";
import Job from "./job.model";
import dailyReportModel from "./dailyReport.model";
import { getRangeFromDate } from "../utils/dates";
import { isHamal } from "../utils/users";

const LOWER_LEVEL_DICTIONARY: Record<string, (branch: be.Branch) => string> = {
    "national": branch => branch.district,
    "district": branch => branch.napa,
    "napa": branch => branch.municipality,
    "municipality": branch => branch.name
}

const BRANCH_FILTER_DICTIONARY: Record<string, any> = {
    "national": () => { },
    "district": district => ({ district: { $eq: district } }),
    "napa": napa => ({ napa: { $eq: napa } }),
    "municipality": municipality => ({ municipalityName: { $eq: municipality } })
}

export async function createFutureReports(req, res) {
    if (!isHamal(req.user)) res.status(403).json("אינך מורשה");

    const { date, reports } = req.body;

    const branches = await Branch.find();
    const branchIdsDictionary = branches.map(_ => _.id).reduce((pv, v) => ({ ...pv, [v]: v }), {});
    const newBranches = reports.filter(report => !branchIdsDictionary[report.id]);

    const { start, end } = getRangeFromDate(new Date(date));
    const dateRange = { $gte: start, $lt: end };
    const dbDailyReports = await dailyReportModel.find({ date: dateRange });

    const dbReportsDictionary = dbDailyReports.map(_ => _.branchId).reduce((pv, v) => ({ ...pv, [v]: v }), {});
    const newReports = reports.filter(report => !dbReportsDictionary[report.id]);

    newBranches.forEach(async branch => await Branch.create(branch));

    newReports.forEach(async report =>
        await dailyReportModel.create({ branchId: report.id, date: new Date(date), total: report.amount }));

    res.status(201).json("");
}

export async function getDailyReport(req, res) {
    const { date, level, value } = req.query;

    if (!isHamal(req.user)) res.status(403).json("אינך מורשה לצפות במידע");

    if (!level || !LOWER_LEVEL_DICTIONARY[level]) return res.status(400).json("רמת ההסתכלות אינה תקינה");

    const branches = await Branch.find(BRANCH_FILTER_DICTIONARY[level](value));
    const branchIds = branches.map(branch => branch.id);

    const { start, end } = getRangeFromDate(new Date(date));
    const dateRange = { $gte: start, $lt: end };

    const reports = await DailyReport.find({
        date: dateRange,
        branchId: { $in: branchIds },
    });

    const jobs = await Job.find({
        distributionPoint: { $in: branches.map(_ => _.name) },
        date: dateRange
    });

    res.json(_groupBySubLevels(level, branches, reports, jobs));
}

function _groupBySubLevels(level: be.Level, branches: be.Branch[], reports: be.DBDailyReport[], jobs: gg.Job[]): be.DailyReport[] {
    const branchIdDictionary: Record<string, be.Branch> = branches.reduce((pv, v) => ({ ...pv, [v.id]: v }), {});
    const branchInfoDictionary: Record<string, be.Branch> = branches.reduce((pv, v) => ({ ...pv, [`${v.municipality}|${v.name}`]: v }), {});

    const lowerLevelDisplayName = LOWER_LEVEL_DICTIONARY[level];

    const totals: Record<number, Omit<be.DailyReport, "name">> = {};

    for (const { city, distributionPoint, status, tasks } of jobs) {
        if (status === "CANCELED") continue;

        const branchId = branchInfoDictionary[`${city}|${distributionPoint}`].id;

        if (!totals[branchId]) totals[branchId] = {
            expected: 0,
            actual: 0,
            delivered: 0,
            deliveryFailed: 0,
            deliveryInProgress: 0,
            deliveryFailReasons: { declined: 0, address: 0, unreachable: 0, other: 0 },
            deliveryProgressStatuses: { unassigned: 0, notdone: 0 }
        };

        for (const { status: taskStatus, failureReason, amount } of tasks) {
            totals[branchId].actual += amount;
            switch (taskStatus) {
                // delivered
                case "DELIVERED":
                    totals[branchId].delivered += amount;
                    break;
                // deliveryInProgress
                case "READY":
                    totals[branchId].deliveryInProgress += amount;
                    totals[branchId].deliveryProgressStatuses.unassigned += amount;
                    break;
                case "UNDELIVERED":
                    totals[branchId].deliveryInProgress += amount;
                    totals[branchId].deliveryProgressStatuses.notdone += amount;
                    break;
                // deliveryFailed
                case "FAILED":
                case "DECLINED":
                    totals[branchId].deliveryFailed += amount;
                    const field = ["DECLINED", "UNREACHABLE", "ADDRESS"].includes(failureReason) ? failureReason.toLowerCase() : "other";
                    totals[branchId].deliveryFailReasons[field] += amount;
                    break;
            }
        }
    }

    for (const { branchId, total, delivered, deliveryFailed, deliveryFailReasons } of reports) {
        if (totals[branchId]) totals[branchId].expected = total;
        else totals[branchId] = {
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
            },
            deliveryProgressStatuses: { unassigned: 0, notdone: 0 }
        };
    }

    return Object.values(Object.entries(totals).reduce((pv, [id, report]) => {
        const name = lowerLevelDisplayName(branchIdDictionary[id]);
        const acc = pv[name];
        const result = _mergeAndFilterResults(name, acc, report);

        return !result ? pv : { ...pv, [name]: result };
    }, {}));
}

function _mergeAndFilterResults(name: string, acc: be.DailyReport, report: Omit<be.DailyReport, "name">): be.DailyReport {
    if(!acc && report.actual === 0) return undefined;

    if (!acc) return { ...report, name };

    if (report.actual === 0) return acc;

    return {
        name,
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
        },
        deliveryProgressStatuses: {
            unassigned: acc.deliveryProgressStatuses.unassigned + report.deliveryProgressStatuses.unassigned,
            notdone: acc.deliveryProgressStatuses.notdone + report.deliveryProgressStatuses.notdone
        }
    };
}