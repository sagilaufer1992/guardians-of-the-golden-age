// api reference for GoldenGuardians

declare namespace gg {
  interface UserInfo {
    username: string;

    // hamal: חמל
    // manager: מנהל חלוקה
    // admin: יוזר מנהל (כמו חמל במערכת שלנו)
    role: "hamal" | "manager" | "admin" | "volunteer";
  }

  interface User extends UserInfo {
    token: string;
    branches: BranchWithMunicipality[];
  }

  interface BranchWithMunicipality {
    name: string; // שם נקודת החלוקה
    municipality: string; // שם הרשות
  }

  interface LoginResult extends UserInfo {
    access_token: string;
    branches: BranchWithMunicipality[];
  }
}
