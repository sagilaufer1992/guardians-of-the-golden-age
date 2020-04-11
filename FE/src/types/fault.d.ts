interface Fault {
  _id: string;
  date: Date;
  author: UserInfo;
  distributionCenter: string;
  content: string;
  category: "food" | "drugs" | "other";
  status: FaultStatus;
}

type FaultStatus = "Todo" | "InProgress" | "Complete";

interface UserInfo {
  name: string;
  role: "hamal" | "manager" | "admin" | "volunteer";
  phone?: string;
}

interface NewMessage {
  author: UserInfo; //מי כתב את ההודעה
  content: string; // תוכן ההודעה
}

interface Message extends NewMessage {
  faultId: string;
  date: Date; // תאריך כתיבת ההודעה
}