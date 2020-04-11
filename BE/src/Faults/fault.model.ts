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
        enum: ['food', 'drugs', 'other']
    },
    author: {
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['hamal', 'manager', 'admin', 'volunteer']
        },
        phone: String
    }
});

export default faultsDB.model('Fault', FaultSchema);
