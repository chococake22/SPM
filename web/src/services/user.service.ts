import api from '@/lib/axios';
import { AxiosError } from 'axios';
import {
  UserInfoRequest,
  UserInfoResponse,
  EditUserPwdRequest,
  EditUserPwdResponse,
  EditUserImgResponse,
} from '@/types/user/type';


export const userService = {
  async user(data: UserInfoRequest): Promise<UserInfoResponse | undefined> {
    try {
      const response = await api.get<UserInfoResponse>('/api/user/info', {
        params: data,
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
  async editUserInfo(data: UserInfoRequest): Promise<UserInfoResponse> {
    try {
      const response = await api.patch<UserInfoResponse>(
        '/api/user/edit',
        data
      );
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

  async editUserPwd(data: EditUserPwdRequest): Promise<EditUserPwdResponse> {
    try {
      await api.patch<EditUserPwdResponse>(
        '/api/user/edit/pwd',
        data
      );
      return {
        data: null,
        status: 200,
        success: true,
        message: '비밀번호가 변경되었습니다.',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data.message ??
          '(오류 발생) 에러가 발생했습니다.';
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

  async editUserProfile(formData: FormData): Promise<EditUserImgResponse> {
    try {
      await api.patch<EditUserImgResponse>(
        '/api/user/edit/img',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return {
        data: null,
        status: 200,
        success: true,
        message: '프로필 이미지가 변경되었습니다.',
      };
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
  async findUserByUsername(username: string): Promise<any> {
    try {
      const response = await api.get(`/api/user/find-by-username/${username}`);
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
};
