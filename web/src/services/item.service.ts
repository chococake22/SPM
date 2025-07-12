import api from '@/lib/axios';
import { ItemListResponse, UploadItemResponse } from '@/types/item/type';
import { AxiosError } from 'axios';

const itemService = {
  async getItems(
    offset: number,
    limit: number
  ): Promise<ItemListResponse | undefined> {
    try {
      const response = await api.get<ItemListResponse>('/api/item/list', {
        params: {
          offset,
          limit,
        },
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

  async getUserItems(
    userId: string | undefined,
    offset: number,
    limit: number
  ): Promise<ItemListResponse | undefined> {
    try {
      const response = await api.get<ItemListResponse>('/api/item/user-list', {
        params: {
          // get 메소드의 경우 param으로 쿼리스트링을 담아야 함.
          userId: userId ? encodeURIComponent(userId) : undefined,
          offset,
          limit,
        },
      });
      return response.data;
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

  async uploadItem(formData: FormData): Promise<UploadItemResponse> {
    try {
      await api.post<UploadItemResponse>(
        '/api/item/upload',
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
};


export default itemService;
