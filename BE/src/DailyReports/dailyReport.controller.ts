import DailyReport from "./dailyReport.model";
import Branch from "../Branches/branch.model";
import dailyReportModel from "./dailyReport.model";

const LOWER_LEVEL_DICTIONARY: be.Dictionary<(branch: be.Branch) => string> = {
    "national": branch => branch.district,
    "district": branch => branch.napa,
    "napa": branch => branch.municipalityName,
    "municipality": branch => branch.name
}

const BRANCH_FILTER_DICTIONARY: be.Dictionary<any> = {
    "national": () => { },
    "district": district => ({ district: { $eq: district } }),
    "napa": napa => ({ napa: { $eq: napa } }),
    "municipality": municipality => ({ municipalityName: { $eq: municipality } })
}

export async function getFutureReports(req, res) {
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
        await dailyReportModel.create({ id: report.id, date: new Date(date), total: report.amount }));

    res.status(201).json();
}

export async function getDailyReport(req, res) {
    const { date: isoDate, level, value } = req.query;
    const date = new Date(isoDate);

    if (!level || !LOWER_LEVEL_DICTIONARY[level]) return res.status(400).json("רמת ההסתכלות אינה תקינה");

    const branchFilter = { ...BRANCH_FILTER_DICTIONARY[level](value) };
    const branches = await Branch.find(branchFilter);
    const branchIds = branches.map(branch => branch.id);

    const dailyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    const filter = { date: { $eq: dailyDate }, id: { $in: branchIds } };
    const reports = (await DailyReport.find(filter)).map(_ => _.toJSON());

    const groupedReports = _groupBy(level, branches as any, reports)
        .map((report: any) => ({ ...report, pendingDelivery: report.total - report.deliveryFailed }));

    res.json(groupedReports);
}

function _groupBy(level: be.Level, branches: be.Branch[], reports: be.dailyReport[]) {
    const groupedReports = {}
    const branchDictionary = branches.reduce((pv, v) => ({ ...pv, [v.id]: v }), {});

    const lowerLevelDisplayName = LOWER_LEVEL_DICTIONARY[level];

    reports.forEach(report => {
        const branch = branchDictionary[report.id];
        const name = lowerLevelDisplayName(branch);

        if (!groupedReports[name]) groupedReports[name] = { name: name };

        const groupedReport = groupedReports[name];
        
        groupedReports[name] = {
            ...groupedReport,
            total: report.total + (groupedReport.total || 0),
            delivered: report.delivered + (groupedReport.delivered || 0),
            deliveryFailed: report.deliveryFailed + (groupedReport.deliveryFailed || 0),
            deliveryFailReasons: (_unionFailedReasons(report.deliveryFailReasons, groupedReport.deliveryFailReasons || {}))
        }
    });

    return Object.values(groupedReports);
}

function _unionFailedReasons(first: be.Dictionary<number>, second: be.Dictionary<number>) {
    const result = { ...first };

    Object.keys(second).forEach(key => {
        result[key] = (result[key] || 0) + second[key];
    });

    return result
}
