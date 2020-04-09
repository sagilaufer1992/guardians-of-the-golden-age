import * as express from "express";

interface User {
    name: string;
    phone: string;
    email?: string;
}

interface Message {
    name: string; //מי כתב את ההודעה 
    content: string // תוכן ההודעה
    date: Date; //תאריך כתיבת ההודעה
}

interface Fault {
    id: string;
    title: string;
    status: "Todo" | "InProgress" | "Complete";
    category: "food" | "drugs" | "other";
    user: User;
    date: Date;
    hierarchy: any // not sure yet;
    chatHistory: Message[] // היסטוריית השיחה בנוגע לתקלה
}

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get("/api/v1/faults", (req, res) => {
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