import * as mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    napa: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    municipalityName: {
        type: String,
        required: true
    },
    municipalitySymbol: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Branch", BranchSchema);
