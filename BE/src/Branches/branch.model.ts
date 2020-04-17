import * as mongoose from "mongoose";
import { faultsDB } from "../cosmosdb";

const BranchSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
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
        type: String
    },
    district: {
        type: String,
        required: true
    },
    homeFrontCommandDistrict: {
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

export default faultsDB.model<mongoose.Document & be.Branch>("Branch", BranchSchema);
