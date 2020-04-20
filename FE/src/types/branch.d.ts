interface Branch extends gg.BranchWithMunicipality {
  id: number;
  address: string; // כתובת
  napa: string; // נפה
  district: string; // מחוז
}

interface Hierarchy {
  district: string;
  napa: string;
  municipality: string;
}