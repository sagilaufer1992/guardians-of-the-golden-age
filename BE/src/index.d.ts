declare namespace be {
  interface NewMessage {
    author: UserInfo; //מי כתב את ההודעה
    content: string; // תוכן ההודעה
  }

  interface NewFault extends NewMessage {
    category: "food" | "drugs" | "other";
    distributionCenter: string;
  }

  interface Fault extends NewFault {
    id: string;
    date: Date;
    status: "Todo" | "InProgress" | "Complete";
  }

  interface UserInfo {
    name: string;
    role: "hamal" | "manager" | "admin" | "volunteer";
    phone?: string;
  }

  interface Message extends NewMessage {
    faultId: string;
    date: Date; // תאריך כתיבת ההודעה
  }

  interface Branch {
    id: string;
    name: string; //שם נקודות החלוקה
    address: string; // כתובת
    napa: string; // נפה
    district: string; // מחוז
    municipalityName: string; // שם הרשות
    municipalitySymbol: number; // מזהה הרשות
  }
}