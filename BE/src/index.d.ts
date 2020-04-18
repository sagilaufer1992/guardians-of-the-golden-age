declare namespace Express {
  interface Request {
    username?: string;
    user?: gg.User;
  }
}

declare namespace gg {
  type Role = "hamal" | "manager" | "admin" | "volunteer";
  interface UserInfo {
    username: string;

    // hamal: חמל
    // manager: מנהל חלוקה
    // admin: יוזר מנהל (כמו חמל במערכת שלנו)
    role: Role
  }

  interface User extends UserInfo {
    token: string;
    municipalities: string[];
    branches: string[];
  }

  interface Task {
    needType: "FOOD" | "DRUGS";
    amount: number;
    status: "READY" | "UNDELIVERED" | "DELIVERED" | "DECLINED" | "FAILED";
    failureReason: "DECLINED" | "UNREACHABLE" | "ADDRESS" | "OTHER";
  }

  interface Job {
    city: string;
    date: Date;
    status: "PENDING" | "DONE" | "CANCELED";
    tasks: Task[];
  }
}

declare namespace be {
  interface NewFault {
    author: AuthorInfo;
    distributionCenter: string;
    content: string;
    category: FaultCategory;
  }

  type Level = "national" | "district" | "napa" | "municipality";

  type FaultStatus = "Todo" | "InProgress" | "Complete";

  type FaultCategory = "food" | "supplier" | "volunteers" | "other";

  interface AuthorInfo {
    name: string;
    phone?: string;
  }

  interface NewMessage {
    author: AuthorInfo; //מי כתב את ההודעה
    content: string; // תוכן ההודעה
  }

  type ExtendItem<T> = Omit<T, "author"> & {
    _id: string;
    date: Date;
    author: AuthorInfo & gg.UserInfo;
  }

  interface Fault extends ExtendItem<NewFault> {
    status: FaultStatus;
  }

  interface Message extends ExtendItem<NewMessage> {
    faultId: string;
  }

  interface Branch {
    id: number;
    name: string; //שם נקודות החלוקה
    address: string; // כתובת
    napa: string; // נפה
    district: string; // מחוז
    municipality: string; // שם הרשות
  }

  interface FutureReport extends Branch {
    amount: number;
  }

  // TODO: לתקן אחרי ראשון, שיסגרו מה נשמר במאגר שלנו ומה להביא מבחוץ
  interface DBDailyReport {
    branchId: number;
    total: number;
    delivered: number;
    deliveryFailed: number;
  }

  interface DailyReport {
    name: string;
    total: number;
    delivered: number;
    deliveryFailed: number;
    deliveryInProgress: number;
    deliveryFailReasons: Record<"declined" | "unreachable" | "address" | "other", number>;
    deliveryProgressStatuses: Record<"unassigned" | "notdone", number>;
  }
}