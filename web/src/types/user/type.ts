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
}
