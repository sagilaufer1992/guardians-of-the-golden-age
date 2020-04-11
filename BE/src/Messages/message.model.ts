const mongoose = require('mongoose');

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
        role: {
            type: String,
            required: true,
            enum: ['hamal', 'manager', 'admin', 'volunteer']
        },
        phone: String
    },
    faultId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Fault',
        required: true
    },
});

export default mongoose.model('Message', MessageSchema);
