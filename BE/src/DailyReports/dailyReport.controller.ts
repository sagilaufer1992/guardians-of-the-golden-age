import DailyReport from "./dailyReport.model";
import Branch from "../Branches/branch.model";
import Job from "./job.model";
import dailyReportModel from "./dailyReport.model";
import { getRangeFromDate } from "../utils/dates";

const LOWER_LEVEL_DICTIONARY: Record<string, (branch: be.Branch) => string> = {
    "national": branch => branch.district,
    "district": branch => branch.napa,
    "napa": branch => branch.municipalityName,
    "municipality": branch => branch.name
}

const BRANCH_FILTER_DICTIONARY: Record<string, any> = {
    "national": () => { },
    "district": district => ({ district: { $eq: district } }),
    "napa": napa => ({ napa: { $eq: napa } }),
    "municipality": municipality => ({ municipalityName: { $eq: municipality } })
}

export async function createFutureReports(req, res) {
    const { role } = req.user as gg.User;

    if (role !== "hamal" && role !== "admin") res.status(403).json("אינך מורשה");

    const { date, reports } = req.body;

    const branches = await Branch.find();
    const branchIdsDictionary = branches.map(_ => _.id).reduce((pv, v) => ({ ...pv, [v]: v }), {});
    const newBranches = reports.filter(report => !branchIdsDictionary[report.id]);

    const dailyReportFilter = { date: { $eq: new Date(date) } };
    const dbDailyReports = await dailyReportModel.find(dailyReportFilter);
    const dbReportsDictionary = dbDailyReports.map(_ => _.id).reduce((pv, v) => ({ ...pv, [v]: v }), {});

    const newReports = reports.filter(report => !dbReportsDictionary[report.id]);

    newBranches.forEach(async report => await Branch.create(report));

    newReports.forEach(async report =>
        await dailyReportModel.create({ branchId: report.id, date: new Date(date), total: report.amount }));

    res.status(201).json();
}

export async function getDailyReport(req, res) {
    const { date, level, value } = req.query;

    if (!level || !LOWER_LEVEL_DICTIONARY[level]) return res.status(400).json("רמת ההסתכלות אינה תקינה");

    const branches = await Branch.find(BRANCH_FILTER_DICTIONARY[level](value));
    const branchIds = branches.map(branch => branch.id);

    const { start, end } = getRangeFromDate(new Date(date));
    const dateRange = { $gte: start, $lt: end };

    const totals = await DailyReport.find({
        date: dateRange,
        branchId: { $in: branchIds },
    }, "branchId total");

    const jobs = await Job.find({
        city: { $in: branches.map(_ => _.name) },
        date: dateRange
    });

    const groupedReports = _groupBySubLevels(level, branches, totals, jobs)
        .map((report: any) => ({ ...report, pendingDelivery: report.total - report.deliveryFailed }));

    res.json(groupedReports);
}

function _groupBySubLevels(level: be.Level, branches: be.Branch[], reports: be.DBDailyReport[], jobs: gg.Job[]): be.DailyReport[] {
    const branchDictionary: Record<string, be.Branch> = branches.reduce((pv, v) => ({ ...pv, [v.id]: v }), {});

    const lowerLevelDisplayName = LOWER_LEVEL_DICTIONARY[level];

    const totals: Record<string, be.DailyReport> = {};

    for (const { branchId, total } of reports) {
        const branch = branchDictionary[branchId];
        const name = lowerLevelDisplayName(branch);

        if (totals[name]) totals[name].total += total;
        else totals[name] = {
            name: name,
            total,
            delivered: 0,
            deliveryFailed: 0,
            deliveryInProgress: 0,
            deliveryFailReasons: { declined: 0, failed: 0 },
            deliveryProgressStatuses: { unassigned: 0, notdone: 0 }
        };

        for (const { status, tasks } of jobs.filter(_ => _.city === branch.name)) {
            if (status === "CANCELED") continue;

            for (const { status: taskStatus, amount } of tasks) {
                switch (taskStatus) {
                    // delivered
                    case "DELIVERED":
                        totals[name].delivered += amount;
                        break;
                    // deliveryInProgress
                    case "READY":
                        totals[name].deliveryInProgress += amount;
                        totals[name].deliveryProgressStatuses.unassigned += amount;
                        break;
                    case "UNDELIVERED":
                        totals[name].deliveryInProgress += amount;
                        totals[name].deliveryProgressStatuses.notdone += amount;
                        break;
                    // deliveryFailed
                    case "DECLINED":
                        totals[name].deliveryFailed += amount;
                        totals[name].deliveryFailReasons.declined += amount;
                        break;
                    case "FAILED":
                        totals[name].deliveryFailed += amount;
                        totals[name].deliveryFailReasons.failed += amount;
                        break;
                }
            }
        }
    }

    return Object.values(totals);
}