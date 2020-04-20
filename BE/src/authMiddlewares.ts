import * as express from "express";
import * as jwt from "jsonwebtoken";
import { authGroupsToBranches } from "./utils/users";

export const DEV_USER: gg.User = { token: "VERY_COOL_TOKEN", username: "dev-user", role: "hamal", branches: [{ name: "מתנס אבו גוש", municipality: "רחובות" }] };
export const JWT_ALGORITHM = "HS256";
export const JWT_SECRET = process.env.USERS_TOKEN_SECRET;

export const requireAuthMiddleware: express.RequestHandler = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization?.startsWith("Bearer"))
        return res.status(400).send("לא נשלחו פרטי ההזדהות");

    if (process.env.NODE_ENV === "development") {
        req.username = DEV_USER.username;
        return next();
    }

    let token: string = null;

    try {
        token = authorization.split(" ")[1];
        const { sub: username } = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
        req.username = username;
    }
    catch (err) {
        return res.status(401).send("פרטי ההזדהות אינם תקניים");
    }

    next();
}

export const userInfoMiddleware: express.RequestHandler = async (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        req.user = DEV_USER;
        return next();
    }

    const User = require("./Auth/auth.model").default;

    const user = await User.findOne({ username: req.username });

    if (!user) return res.status(401).send("המשתמש לא קיים במאגר");

    req.user = {
        token: req.headers.authorization.substring(7),
        username: user.username,
        role: user.role,
        branches: authGroupsToBranches(user.authGroups)
    };

    next();
}