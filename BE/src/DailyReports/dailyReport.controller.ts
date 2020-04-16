import DailyReport from "./dailyReport.model";
import Branch from "../Branches/branch.model";
import dailyReportModel from "./dailyReport.model";

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