import { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";

import User from "./auth.model";
import Branch from "../Branches/branch.model";
import { DEV_USER, JWT_SECRET, JWT_ALGORITHM } from "../authMiddlewares";

const EXP_TIME = 24 * 60 * 60 * 1000;

export async function getUserByToken(req, res, next) {
    res.status(200).json(req.user);
}

export async function loginUser(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send("שם המשתמש או הסיסמה אינם תקניים");

    if (process.env.NODE_ENV === "development")
        return res.status(200).json({ ...DEV_USER, access_token: DEV_USER.token });

    const user = await User.findOne({ username });

    if (!user) return res.status(400).send("שם המשתמש או הסיסמה אינם תקניים");

    const { passwordHash, _id, authGroups, ...userInfo } = user.toJSON();

    let branches = [];
    if (user.role !== "hamal" && user.role !== "admin")
        branches = await Branch.find({ municipality: { $in: authGroups } });

    try {
        const result = await compare(password, passwordHash);
        if (!result) throw new Error();

        const access_token = jwt.sign({ sub: username, exp: Date.now() + EXP_TIME }, JWT_SECRET, { algorithm: JWT_ALGORITHM });

        res.status(200).json({
            access_token,
            token_type: "bearer",
            municipalities: authGroups,
            branches: branches.map(_ => _.name),
            ...userInfo
        });
    }
    catch (err) {
        return res.status(400).send("שם המשתמש או הסיסמה אינם תקניים");
    }
}