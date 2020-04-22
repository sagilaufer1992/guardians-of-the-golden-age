import * as mongoose from "mongoose";
import { faultsDB } from "../cosmosdb";
import { getBranchIdentifier } from "../utils/users";

const FaultSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    distributionCenter: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Todo',
        enum: ['Todo', 'InProgress', 'Complete']
    },
    category: {
        type: String,
        required: true,
        enum: ["food", "supplier", "volunteers", "other"]
    },
    author: {
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ["hamal", "manager", "admin", "volunteer"]
        },
        phone: String
    },
    branch: {
        identifier: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        municipality: {
            type: String,
            required: true
        },
        napa: {
            type: String,
        },
        district: {
            type: String,
        },        
    }
});

export default faultsDB.model<mongoose.Document & be.Fault>('Fault', FaultSchema);
