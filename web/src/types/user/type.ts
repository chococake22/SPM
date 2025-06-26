export interface SignupRequest {
  userId: string;
  userPw: string;
  userPwChk: string;
  username: string;
  phone: string;
  address: string;
}

export interface SignupResponse {
  data?: UserData;
  success: boolean;
  message: string;
  status: number;
}

export interface LoginForm {
  userId?: string | FormDataEntryValue | null;
  userPw?: string | FormDataEntryValue | null;
}

export interface LoginResponse {
  data?: UserData;
  success: boolean;
  message: string;
  status: number;
}

export type UserData = {
  id: string | undefined;
  userId: string | undefined;
  status?: number | undefined;
  redirectUrl?: string | undefined;
  username?: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
  profileImg?: string | undefined;
};

export interface LogoutRequest {
  userId: string;
  userPw: string;
  username: string;
  phone: string;
}

export interface LogoutResponse {
  data?: UserData;
  success: boolean;
  message: string;
  status: number;
}

export interface LoginResponse {
  data?: UserData;
  success: boolean;
  message: string;
  status: number;
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
  profileImg?: string;
}

export interface UserInfoResponse {
  data?: UserData;
  success: boolean;
  message: string;
  status: number;
}

export interface CheckUserIdResponse {
  data?: UserData;
  success: boolean;
  message: string;
  status: number;
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

export interface EditUserImgRequest {
  userId: string;
  profileImg: string;
}

export interface EditUserImgResponse {
  success: boolean;
  message: string;
}
