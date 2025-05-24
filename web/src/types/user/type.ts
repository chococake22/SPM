export interface SignupRequest {
  userId: string;
  userPw: string;
  userPwChk: string;
  username: string;
  phone: string;
  address: string;
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
  data?: tokenSet;
  status?: number;
  redirectUrl?: string;
  username?: string;
  phone?: string;
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

export interface UserInfoRequest {
  userId: string;
}

export interface UserInfoResponse {
  userId: string;
  username: string;
  phone: string;
}
