interface NewFault {
  author: AuthorInfo;
  distributionCenter: string;
  content: string;
  category: FaultCategory;
}

type FaultStatus = "Todo" | "InProgress" | "Complete";

type FaultCategory = "food" | "drugs" | "other";

type Level = "all" | "district" | "napa";

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

interface FaultManager {
  faults: Fault[];
  isRefresh: boolean;
  lastRefreshTime: Date | null;
  level: Level | null;
  setDate: (date: Date) => void;
  setLevel: (level: Level) => void;
  setLevelValue: (levelValue: string) => void;
  setUser: (user: UserInfo) => void;
  deleteFault: (id: string) => void;
  setFaultStatus: (faultId: string, status: FaultStatus) => void;
}