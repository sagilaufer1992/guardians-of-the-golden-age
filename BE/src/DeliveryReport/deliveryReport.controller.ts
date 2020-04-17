import DailyReport from "../DailyReports/dailyReport.model";

export async function updateDeliveryReport(req, res) {
    try {
        const { date, branchId } = req.params;
        
        const response = await DailyReport.findOneAndUpdate({date, branchId}, req.body);
        res.send(response);
    } catch {
        res.status(500);
    }
}

export async function getDeliveryReport(req, res) {
    try {
        const { date, branchId } = req.params;

        const response = await DailyReport.find({branchId, date});
        res.json(response);
    } catch {
        res.status(500);
    }
}