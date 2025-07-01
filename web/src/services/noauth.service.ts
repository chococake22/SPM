import api from '@/lib/axios';
import {
  LoginForm,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  LogoutRequest,
  LogoutResponse,
  UserInfoRequest,
  UserInfoResponse,
  CheckUserIdResponse,
} from '@/types/user/type';
import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';

// noauthService는 인증이 필요없는 api
export const noauthService = {
  async login(data: LoginForm): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/login', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message ?? '(오류 발생) 에러가 발생했습니다.';
        const status = error.response?.status ?? 500;
        return {
          data: null,
          success: false,
          message: message,
          status: status 
        };
      } else {
        return {
          data: null,
          success: false,
          message: '(오류 발생) 에러가 발생했습니다.',
          status: 500,
        };
      }
    }
  },
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await api.post<SignupResponse>('/api/signup', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data.message ?? '(오류 발생) 에러가 발생했습니다.';
        const status = error.response?.status ?? 500;
        return {
          data: null,
          success: false,
          message: message,
          status: status,
        };
      } else {
        return {
          data: null,
          success: false,
          message: '(오류 발생) 에러가 발생했습니다.',
          status: 500,
        };
      }
    }
  },
  async logout(data?: LogoutRequest): Promise<LogoutResponse | undefined> {
    try {
      const response = await api.post<LogoutResponse>('/api/logout', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message ?? '(오류 발생) 에러가 발생했습니다.';
        const status = error.response?.status ?? 500;
        return {
          data: null,
          success: false,
          message: message,
          status: status,
        };
      } else {
        return {
          data: null,
          success: false,
          message: '(오류 발생) 에러가 발생했습니다.',
          status: 500,
        };
      }
    }
  },
  async checkUserIdExist(userId: string): Promise<CheckUserIdResponse> {
    try {
      const response = await api.get('/api/check/user', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message ?? '(오류 발생) 에러가 발생했습니다.';
        const status = error.response?.status ?? 500;
        return {
          data: null,
          success: false,
          message: message,
          status: status,
        };
      } else {
        return {
          data: null,
          success: false,
          message: '(오류 발생) 에러가 발생했습니다.',
          status: 500,
        };
      }
    }
  },
};
