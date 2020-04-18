const mongoose = require('mongoose');
import { faultsDB } from "../cosmosdb";

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
        id: {
            type: Number,
        },
        name: {
            type: String,
        },
        napa: {
            type: String,
        },
        district: {
            type: String,
        },
        municipality: {
            type: String,
        }
    }
});

export default faultsDB.model('Fault', FaultSchema);
