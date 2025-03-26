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

export interface LoginForm {
  userId: string;
  userPw: string;
}

export interface LoginResponse {
  userId: string;
  data: tokenSet;
  status?: number;
  redirectUrl: string;
}

export interface LogoutRequest {
  userId: string;
  userPw: string;
  username: string;
  phone: string;
}

export interface LogoutReponse {
  userId: string;
  userPw: string;
  username: string;
  phone: string;
}

export type tokenSet = {
  accessToken: string;
  refreshToken: string;
};
