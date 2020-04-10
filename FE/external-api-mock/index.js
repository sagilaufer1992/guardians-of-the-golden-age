const express = require("express");
const cors = require("cors");
const multer = require("multer");

const authForm = multer();

const app = express();

app.use(cors());

const TEST_USER = { username: "יוזר חמל", role: "hamal", authGroups: [] };

app.get("/auth", authForm.none(), (req, res) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer "))
        res.status(400).json({ error: "invalid payload. should pass authorization header" });

    res.json(TEST_USER);
});

app.listen(5555, () => {
    console.log("external api mock server running on port 5555");
});