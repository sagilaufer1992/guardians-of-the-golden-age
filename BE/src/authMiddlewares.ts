import * as express from "express";
import * as jwt from "jsonwebtoken";

export const requireAuth: express.RequestHandler = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization?.startsWith("Bearer"))
        return res.status(400).send("No authorization header in request headers");

    let token: string = null;

    try {
        token = authorization.split(" ")[1];
        const { sub: username } = jwt.verify(token, process.env.USERS_TOKEN_SECRET, { algorithms: ["HS256"] });
        req.username = username;
    }
    catch (err) {
        return res.status(400).send("Invalid authorization token");
    }

    next();
}

export const getUserInfo: express.RequestHandler = async (req, res, next) => {
    const User = require("./Auth/auth.model").default;

    const user = await User.findOne({ username: req.username });

    if (!user) return res.status(404).send("User not found");

    req.user = {
        token: req.headers.authorization.substring(7),
        username: user.username,
        role: user.role,
        authGroups: user.authGroups
    };

    next();
}