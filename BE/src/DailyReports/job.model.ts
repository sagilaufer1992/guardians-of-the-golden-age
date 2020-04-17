import * as mongoose from "mongoose";
import { usersDB } from "../cosmosdb";

const TaskSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    needType: {
        type: String,
        required: true,
        enum: ["FOOD", "DRUG"]
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["READY", "UNDELIVERED", "DELIVERED", "DECLINED", "FAILED"]
    }
});

const JobSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["PENDING", "DONE", "CANCELED"]
    },
    tasks: {
        type: [TaskSchema],
        required: true
    }
});

export default usersDB.model<mongoose.Document & gg.Job>("Job", JobSchema, "jobs");
