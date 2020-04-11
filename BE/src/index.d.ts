declare namespace Express {
  interface Request {
    username?: string;
    user?: gg.User;
  }
}

declare namespace gg {
  type Role = "hamal" | "manager" | "admin" | "volunteer";

  interface User {
    token: string;
    username: string;
    role: gg.Role;
    authGroups: string[];
  }
}

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
    role: gg.Role;
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