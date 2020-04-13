import User from "./auth.model";
import { compare } from "bcrypt";
import * as jwt from "jsonwebtoken";

const EXP_TIME = 24 * 60 * 60 * 1000;

export async function getUserByToken(req, res, next) {
    res.status(200).json(req.user);
}

export async function loginUser(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send("invalid username or password");

    const user = await User.findOne({ username });

    if (!user) return res.status(400).send("invalid username or password");

    const { passwordHash, _id, ...userInfo } = user.toJSON();

    try {
        const result = await compare(password, passwordHash);
        if (!result) throw new Error();

        const access_token = jwt.sign({ sub: username, exp: Date.now() + EXP_TIME }, process.env.USERS_TOKEN_SECRET, { algorithm: "HS256" });

        res.status(200).json({ access_token, token_type: "bearer", ...userInfo });
    }
    catch (err) {
        return res.status(400).send("invalid username or password");
    }
}