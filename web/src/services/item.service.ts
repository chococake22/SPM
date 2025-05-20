import api from '@/lib/axios';
import { ItemListResponse } from '@/types/item/type';

const itemService = {
  async getItems(offset: number, limit: number): Promise<ItemListResponse[]> {
    const params = {
      offset: offset,
      limit: limit,
    };

    console.log(params);

    try {
      const response = await api.post<ItemListResponse[]>(
        '/api/getItemList',
        params
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        alert('에러1');
        return [];
      } else {
        alert('에러2');
        return [];
      }
    }
  },

  async getUserItems(
    username: string,
    offset: number,
    limit: number
  ): Promise<ItemListResponse[]> {
    try {
      const response = await api.get<ItemListResponse[]>(
        '/api/getUserItemList',
        {
          params: {           // get 메소드의 경우 param으로 쿼리스트링을 담아야 함.
            username,
            offset,
            limit,
          },
        }
      );
      return response.data;
    } catch (error) {
      alert('에러 발생');
      return [];
    }
  },
};

export default itemService;
