import * as express from "express";
import { getFaults } from "./faults";
require('express-async-errors');

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/checkdb", async (req, res) => {
    const result = await getFaults();
    res.json(result);
});

app.get("/api/v1/faults", async (req, res) => {
    const fault: Fault = {
        id: "fault",
        title: "לא הגיעה משאית",
        status: "Todo",
        category: "food",
        user: { name: "roni", phone: "0500000000" },
        date: new Date(),
        hierarchy: [],
        chatHistory: [{ name: "roni", content: "לא הגיעה המשאית של הבוקר, יש מלא זקנים שאי אפשר לעזור להם. דחוף מאוד", date: new Date() }]
    }
    res.json([fault]);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})