import api from '@/lib/axios';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '@/types/user/type';

export const userService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/login', data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        alert('(오류발생)다시 시도해주세요.');
        return {} as LoginResponse;
      } 
    }
  },
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await api.post<SignupRequest>('/api/signup', data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        alert('에러 발생');
        return {} as SignupResponse;
      } else {
        alert('(오류발생)다시 시도해주세요.');
        return {} as SignupResponse;
      }
    }
  },
};
