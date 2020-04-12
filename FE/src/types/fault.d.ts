interface NewFault {
  author: AuthorInfo;
  distributionCenter: string;
  content: string;
  category: FaultCategory;  
}

type FaultStatus = "Todo" | "InProgress" | "Complete";

type FaultCategory = "food" | "drugs" | "other";

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
  branch?: Branch;
}

interface Message extends ExtendItem<NewMessage> {
  faultId: string;
}