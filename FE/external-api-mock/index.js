const express = require("express");
const cors = require("cors");
const multer = require("multer");

const authForm = multer();

const app = express();

app.use(cors());

const TEST_USER = { userName: "בדיקה", access_token: "1242141", authGroups: ["קבוצת בדיקה"] };

app.post("/login", authForm.none(), (req, res) => {
    if (!req.body.username || !req.body.password)
        res.status(400).json({ error: "invalid payload. should use multipart/form-data with username,password fields" });

    res.json(TEST_USER);
});

app.get("/auth", authForm.none(), (req, res) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer "))
        res.status(400).json({ error: "invalid payload. should pass authorization header" });

    res.json(TEST_USER);
});

app.listen(5000, () => {
    console.log("external api mock server running on port 5555");
});