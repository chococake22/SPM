import api from '@/lib/axios';
import {
  LoginResponse,
  SignupRequest,
  SignupResponse,
  LogoutRequest,
  LogoutResponse,
  UserInfoRequest,
  UserInfoResponse,
  CheckUserIdResponse,
  LoginForm,
  EditUserPwdRequest,
  EditUserPwdResponse,
  EditUserImgResponse,
} from '@/types/user/type';
import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';

export const userService = {
  async user(data: UserInfoRequest): Promise<UserInfoResponse | undefined> {
    try {
      const response = await api.get<UserInfoResponse>('/api/user/info', {
        params: data,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.log('status: ' + status);
        if (status === 401) {
          redirect('/expired');
        } else {
          alert(`요청 실패: ${message}`);
        }
      } else {
        alert('Unexpected Error!');
      }
    }
  },
  async editUserInfo(data: UserInfoRequest): Promise<UserInfoResponse> {
    try {
      const response = await api.patch<UserInfoResponse>(
        '/api/user/edit',
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('status: ' + error.response?.status);
        console.log('message: ' + error.response?.data.message);
        return {} as UserInfoResponse;
      } else {
        return {} as UserInfoResponse;
      }
    }
  },

  async editUserPwd(data: EditUserPwdRequest): Promise<EditUserPwdResponse> {
    try {
      const response = await api.patch<EditUserPwdResponse>(
        '/api/user/edit/pwd',
        data
      );
      return {
        success: true,
        message: '비밀번호가 변경되었습니다.',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        console.log('status: ' + error.response?.status);
        console.log('message: ' + message);
        return {
          success: false,
          message,
        };
      } else {
        return {
          success: false,
          message: '(시스템 오류) 다시 시도해주세요',
        };
      }
    }
  },

  async editUserProfile(formData: FormData): Promise<EditUserImgResponse> {
    try {
      const response = await api.patch<EditUserImgResponse>(
        '/api/user/edit/img',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return {
        success: true,
        message: '프로필 이미지가 변경되었습니다.',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        console.log('status: ' + error.response?.status);
        console.log('message: ' + message);
        return {
          success: false,
          message,
        };
      } else {
        return {
          success: false,
          message: '(시스템 오류) 다시 시도해주세요',
        };
      }
    }
  },
  async getUserProfileImg(
    data: UserInfoRequest
  ): Promise<UserInfoResponse | undefined> {
    console.log(data)
    try {
      const response = await api.get<UserInfoResponse>('/api/user/img', {
        params: data,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.log('status: ' + status);
        if (status === 401) {
          redirect('/expired');
        } else {
          alert(`요청 실패: ${message}`);
        }
      } else {
        alert('Unexpected Error!');
      }
    }
  },
};
