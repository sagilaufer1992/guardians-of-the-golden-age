declare namespace be {
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
        id?: string;
        title: string;
        status: "Todo" | "InProgress" | "Complete";
        category: "food" | "drugs" | "other";
        user: User;
        date: Date;
        hierarchy: any // not sure yet;
        chatHistory: Message[] // היסטוריית השיחה בנוגע לתקלה
    }
}