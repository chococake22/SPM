import api from '@/lib/axios';
import { ItemListResponse } from '@/types/item/type';
import { redirect } from 'next/navigation';
import { AxiosError } from 'axios';

const itemService = {
  async getItems(offset: number, limit: number): Promise<ItemListResponse[] | undefined> {
    const params = {
      offset: offset,
      limit: limit,
    };
    try {
      const response = await api.post<ItemListResponse[]>(
        '/api/item/getItemList',
        params
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        console.log("status: " + status)
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
    username: string | undefined,
    offset: number,
    limit: number
  ): Promise<ItemListResponse[] | undefined> {
    try {
      const response = await api.get<ItemListResponse[]>(
        '/api/item/getUserItemList',
        {
          params: {
            // get 메소드의 경우 param으로 쿼리스트링을 담아야 함.
            username,
            offset,
            limit,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {

        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        console.log('status: ' + status);

        if(status === 401) {
          redirect('/expired');
        } else {
          alert(`요청 실패: ${message}`)
        }
      } else {
        alert('Unexpected Error!')
      }
    }
  },
};


export default itemService;
