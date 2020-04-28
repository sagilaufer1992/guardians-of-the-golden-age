import DailyReport from "../DailyReports/dailyReport.model";

export async function incrementDeliveryReport(req, res) {
    try {
        const { date, branchId } = req.params;

        const { delivered = 0, total = 0, deliveryType } = req.body;

        const findByDelivered = `deliveries.${deliveryType}.delivered`;

        const update = { $inc: { [findByDelivered]: delivered } };

        const response = await DailyReport.findOneAndUpdate(
            { date, branchId, [findByDelivered]: { $lte: total - delivered } }, update, { new: true });
        res.status(200).json(response);
    } catch {
        res.status(500).send("אירעה שגיאה בעדכון הטופס הידני");
    }
}

export async function updateDeliveryReport(req, res) {
    try {
        const { date, branchId } = req.params;
        const { deliveryType, deliveryFailed = null, delivered = null, deliveryFailReasons = null } = req.body;

        const findByDelivered = `deliveries.${deliveryType}`;

        const update = {
            $set: {}
        }

        if (deliveryFailed) update.$set[findByDelivered + '.deliveryFailed'] = deliveryFailed;
        if (delivered) update.$set[findByDelivered + '.delivered'] = delivered;
        if (deliveryFailReasons) update.$set[findByDelivered + '.deliveryFailReasons'] = deliveryFailReasons;

        const response = await DailyReport.findOneAndUpdate(
            { date, branchId }, update, { new: true });
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