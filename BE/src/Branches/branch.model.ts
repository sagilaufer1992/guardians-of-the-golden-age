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
    municipality: {
        type: String,
        required: true
    }
});

export default faultsDB.model<mongoose.Document & be.Branch>("Branch", BranchSchema, "branches");
