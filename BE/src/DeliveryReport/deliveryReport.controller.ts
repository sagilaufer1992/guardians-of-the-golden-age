import DailyReport from "../DailyReports/dailyReport.model";

export async function incrementDeliveryReport(req, res) {
    try {
        const { date, branchId } = req.params;

        const { delivered = 0, total = 0 } = req.body;

        const update = { $inc: { delivered } };

        const response = await DailyReport.findOneAndUpdate(
            { date, branchId, delivered: { $lte: total - delivered } }, update, { new: true });
        res.status(200).json(response);
    } catch {
        res.status(500).send("אירעה שגיאה בעדכון הטופס הידני");
    }
}

export async function updateDeliveryReport(req, res) {
    try {
        const { date, branchId } = req.params;

        const response = await DailyReport.findOneAndUpdate({ date, branchId }, req.body, { new: true });
        res.status(200).json(response);
    } catch {
        res.status(500).send("אירעה שגיאה בעדכון הטופס הידני");
    }
}

export async function getDeliveryReport(req, res) {
    try {
        const { date, branchId } = req.params;

        const response = await DailyReport.findOne({ branchId, date });

        if (!response) return res.status(404).send("לא נמצא מידע עבור מרכז החלוקה");

        res.status(200).json(response);
    } catch {
        res.status(500).send("אירעה שגיאה בקבלת פרטים על מרכז החלוקה");
    }
}