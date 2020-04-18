import * as mongoose from "mongoose";
import { usersDB } from "../cosmosdb";

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
        type: [String],
        required: true
    },
    passwordHash: {
        type: String
    }
});

export default usersDB.model<mongoose.Document & gg.User>("User", UserSchema, "users");
