interface Branch {
    id: number;
    name: string; //שם נקודות החלוקה
    address: string; // כתובת
    napa: string; // נפה
    district: string; // מחוז
    municipality: string; // שם הרשות
  }

  interface Hierarchy {
    district: string;
    napa: string;
    municipality: string;
  }