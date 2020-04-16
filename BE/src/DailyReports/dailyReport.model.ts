import * as mongoose from "mongoose";
import { faultsDB } from "../cosmosdb";

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

export default faultsDB.model("DailyReport", DailyReportSchema, "dailyReports");
