import * as mongoose from "mongoose";
import { faultsDB } from "../cosmosdb";

const ReseanSchema = new mongoose.Schema({
    count: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
});

const DailyReportSchema = new mongoose.Schema({
    id: {
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
        type: [ReseanSchema],
        default: []
    }
});

export default faultsDB.model("DailyReport", DailyReportSchema, "dailyReports");
