// api reference for GoldenGuardians

declare namespace gg {
  interface User {
    username: string;

    // hamal: חמל
    // manager: מנהל חלוקה
    // admin: יוזר מנהל (כמו חמל במערכת שלנו)
    role: "hamal" | "manager" | "admin" | "volunteer";

    // list of distribution centers that a user is authorized to see
    // example: מ"ח ת"א
    authGroups: string[];
  }
}
