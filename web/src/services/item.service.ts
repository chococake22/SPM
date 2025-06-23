import api from '@/lib/axios';
import { ItemListResponse, UploadItemResponse } from '@/types/item/type';
import { redirect } from 'next/navigation';
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

  async getUserItems(
    id: string | undefined,
    offset: number,
    limit: number
  ): Promise<ItemListResponse | undefined> {
    try {
      const response = await api.get<ItemListResponse>('/api/item/user-list', {
        params: {
          // get 메소드의 경우 param으로 쿼리스트링을 담아야 함.
          id,
          offset,
          limit,
        },
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

  async uploadItem(formData: FormData): Promise<UploadItemResponse> {
    try {
      const response = await api.post<UploadItemResponse>(
        '/api/item/upload',
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
};


export default itemService;
