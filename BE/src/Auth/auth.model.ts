import * as mongoose from "mongoose";
import { usersDB } from "../cosmosdb";

const AuthGroupSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    distributionPoints: {
        type: [String],
        require: true
    }
});

const UserSchema = new mongoose.Schema({
    _id: {
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
    authGroups: {
        type: [AuthGroupSchema],
        required: true
    },
    passwordHash: {
        type: String
    }
});

export default usersDB.model("User", UserSchema, "users");
