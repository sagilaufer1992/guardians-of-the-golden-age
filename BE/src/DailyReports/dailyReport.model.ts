import * as mongoose from "mongoose";
import { faultsDB } from "../cosmosdb";

const Delivery = new mongoose.Schema({
    total: {
        type: Number,
        required: true
    },
    delivered: {
        type: Number,
        default: 0
    },
    deliveryFailed: {
        type: Number,
        default: 0
    },
    deliveryFailReasons: {
        type: Map,
        of: Number,
        default: {}
    }
});

// TODO: RENAME ID TO BRANCH ID
const DailyReportSchema = new mongoose.Schema({
    branchId: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    deliveries: {
        type: Map,
        of: Delivery
    }
});

export default faultsDB.model<mongoose.Document & be.DBDailyReport>("DailyReport", DailyReportSchema, "dailyReports");
