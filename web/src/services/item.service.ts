import api from 'axios';
import { ItemListResponse } from '@/types/item/type';

const itemService = {
  async getItems(data: null): Promise<ItemListResponse[]> {
    try {
      const response = await api.post<ItemListResponse[]>('/getItemList', data);
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
