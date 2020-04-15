import DailyReport from "./dailyReport.model";
import Branch from "../Branches/branch.model";
import dailyReportModel from "./dailyReport.model";

export async function getFutureReports(req, res) {
    const { role } = req.user as gg.User;

    if (role !== "hamal" && role !== "admin") res.status(403).json("אינך מורשה");

    const { date, reports } = req.body;
    const branches = await Branch.find();

    reports.forEach(async report => {
        if (!branches.some(branch => branch.id === report.id)) {
            console.log(report);
            await Branch.create(report);
        }

        const filter = { id: { $eq: report.id }, date: { $eq: new Date(date) } };

        // TODO: try to do it better.
        if (!!await dailyReportModel.findOne(filter)) return;

        await dailyReportModel.create({ id: report.id, date: new Date(date), total: report.amount });
    })

    res.status(201).json();
}

function _removeDuplicates<T>(array: T[], getId: (item: T) => any = _ => _) {
    return array.filter(
        (thing, i, arr) => arr.findIndex(t => getId(t) === getId(thing)) === i
    );
}