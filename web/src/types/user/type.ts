export interface SignupRequest {
  userId: string;
  userPw: string;
  username: string;
  phone: string;
}

export interface SignupReponse {
  userId: string;
  userPw: string;
  username: string;
  phone: string;
}

// export interface SignupForm {
//   userId: string;
//   userPw: string;
//   userPwChk: string;
//   username: string;
//   phone: string;
// }

export interface LoginForm {
  userId: string;
  userPw: string;
}

export interface LoginResponse {
  userId: string;
  data: tokenSet;
}

export type tokenSet = {
  accessToken: string;
  refreshToken: string;
};
