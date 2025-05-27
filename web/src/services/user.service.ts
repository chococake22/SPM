import api from '@/lib/axios';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  LogoutRequest,
  LogoutResponse,
  UserInfoRequest,
  UserInfoResponse,
} from '@/types/user/type';
import { AxiosError } from 'axios';

export const userService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/login', data);
      return response.data;
    } catch (error) {
      console.log('Error object:', error);
      console.log(error instanceof AxiosError);

      // axios는 404나 500을 catch단에서 Erorr로 처리함.
      if (error instanceof AxiosError) {
        console.log('status: ' + error.response?.status);
        console.log('message: ' + error.response?.data.message);

        // 404 상태일 경우 로그인 실패 처리
        if (error.response?.status === 404) {
          alert(error.response?.data.message);
        } else {
          alert('(오류 발생) 다시 시도해 주세요.');
        }

        return {} as LoginResponse;
      } else {
        // 일반적인 오류 처리
        console.log('Network or server error');
        alert('(오류 발생) 다시 시도해 주세요.');
        return {} as LoginResponse;
      }
    }
  },
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await api.post<SignupResponse>('/api/user/signup', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        alert('signup 에러 발생');
        return {} as SignupResponse;
      } else {
        alert('(오류발생)다시 시도해주세요.');
        return {} as SignupResponse;
      }
    }
  },
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutRequest>('/api/user/logout');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        alert('logout 에러 발생');
        return {} as LogoutResponse;
      } else {
        alert('(오류발생)다시 시도해주세요.');
        return {} as LogoutResponse;
      }
    }
  },

  async user(data: UserInfoRequest): Promise<UserInfoResponse> {
    try {
      const response = await api.get<UserInfoResponse>('/api/user/info', {
        params: data,
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        alert('user 에러 발생');
        return {} as LogoutResponse;
      } else {
        alert('(오류발생)다시 시도해주세요.');
        return {} as LogoutResponse;
      }
    }
  },

  async checkUserIdExist(userId: string): Promise<boolean> {
    try {
      const response = await api.get('/api/user/check', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        alert('checkUserIdExist 에러 발생');
        return {} as LogoutResponse;
      } else {
        alert('(오류발생)다시 시도해주세요.');
        return {} as LogoutResponse;
      }
    }
  },

  async editUserInfo(data: UserInfoRequest): Promise<UserInfoResponse> {
    try {
      const response = await api.post<UserInfoResponse>('/api/user/edit', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        alert('editUserInfo 에러 발생');
        return {} as SignupResponse;
      } else {
        alert('(오류발생)다시 시도해주세요.');
        return {} as SignupResponse;
      }
    }
  },
};
