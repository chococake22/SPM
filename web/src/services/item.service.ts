import api from '@/lib/axios';
import { ItemListResponse } from '@/types/item/type';

const itemService = {
  async getItems(offset: number, limit: number): Promise<ItemListResponse[]> {

    const params = {
      offset: offset,
      limit: limit
    }

    console.log(params)

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
};

export default itemService;
