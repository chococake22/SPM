export interface SignupRequest {
  userId: string;
  userPw: string;
  userPwChk: string;
  username: string;
  phone: string;
  address: string;
}

export interface SignupResponse {
  userId: string;
  userPw?: string;
  username: string;
  phone: string;
  status? :number;
  address?: string;

}

export interface LoginForm {
  userId?: string | FormDataEntryValue | null;
  userPw?: string | FormDataEntryValue | null;
}

export interface LoginResponse {
  userId: string | undefined;
  status?: number | undefined;
  redirectUrl?: string | undefined;
  username?: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
  profileImg?: string | undefined;
}

export interface LogoutRequest {
  userId: string;
  userPw: string;
  username: string;
  phone: string;
}

export interface LogoutResponse {
  userId: string;
  userPw: string;
  username: string;
  phone: string;
  message?: string;
}

export type tokenSet = {
  accessToken: string;
  refreshToken: string;
};

export interface UserInfoRequest {
  userId?: string;
  username?: string;
  phone?: string;
  address?: string;
}

export interface UserInfoData {
  userId: string;
  username: string;
  phone: string;
  address: string;
  message?: string;
}

export interface UserInfoResponse {
  data: UserInfoData;
  status?: number;
}

export interface CheckUserIdResponse {
  data: UserIdResponse;
  success: boolean;
}

export interface UserIdResponse {
  userId?: string;
}


export interface EditUserPwdRequest {
  userId?: string;
  nowPwd: string;
  newPwd: string;
  newPwdConfirm: string;
}

export interface EditUserPwdResponse {
  success: boolean;
  message: string;
}
