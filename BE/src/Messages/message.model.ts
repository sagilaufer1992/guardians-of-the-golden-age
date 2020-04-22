import { Document } from 'mongoose';
const mongoose = require('mongoose');

import { faultsDB } from '../cosmosdb';

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
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
    faultId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Fault',
        required: true
    },
});

export default faultsDB.model<Document & be.Message>('Message', MessageSchema);
