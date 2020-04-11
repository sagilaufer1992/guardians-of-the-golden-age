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
    auth_groups: {
        type: [String],
        required: true
    },
    password_hash: {
        type: String
    }
});

export default usersDB.model("User", UserSchema, "users");
