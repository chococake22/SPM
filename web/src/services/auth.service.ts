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
} from '@/types/user/type';
import { AxiosError } from 'axios';

export const authService = {
  async getAccessToken(data: LoginForm): Promise<LoginResponse> {
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
};
