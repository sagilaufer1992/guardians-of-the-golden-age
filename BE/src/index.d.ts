declare namespace be {
    interface Branch{
        id:string;
        name:string; //שם נקודות החלוקה
        address: string // כתובת
        napa: string // נפה 
        district: string // מחוז
        municipalityName: string // שם הרשות
        municipalitySymbol: number // מזהה הרשות
    }
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