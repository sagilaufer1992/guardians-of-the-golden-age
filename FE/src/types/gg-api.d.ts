// api reference for GoldenGuardians

declare namespace gg {
  // params to send to /login api, with content-type=multipart/form-data
  interface LoginParams {
    username: string;
    password: string;
  }

  interface User {
    // JWT token (can be stored locally for reuse)
    access_token: string;

    username: string;

    // list of areas that a user is authorized to see
    // example area: מ"ח ת"א
    authGroups: string[];
  }
}
