import api from '@/lib/axios';
import { ItemListResponse  } from '@/types/item/type';
import { BoardDetailResponse, BoardListResponse, UploadBoardRequest, UploadBoardResponse } from '@/types/board/type';
import { redirect } from 'next/navigation';
import { AxiosError } from 'axios';

const boardService = {
  async getBoards(
    offset: number,
    limit: number
  ): Promise<BoardListResponse | undefined> {
    try {
      const response = await api.get<BoardListResponse>('/api/board/list', {
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

  async getBoardDetail(id: string): Promise<BoardDetailResponse | undefined> {
    console.log('id: ' + id);
    try {
      const response = await api.get<BoardDetailResponse>(`/api/board/detail/${id}`);
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

  async getUserBoards(
    username: string | undefined,
    offset: number,
    limit: number
  ): Promise<ItemListResponse | undefined> {
    try {
      const response = await api.get<ItemListResponse>('/api/item/user-list', {
        params: {
          // get 메소드의 경우 param으로 쿼리스트링을 담아야 함.
          username,
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

  async uploadBoard(data: UploadBoardRequest): Promise<UploadBoardResponse> {
    try {
      const response = await api.post<UploadBoardResponse>(
        '/api/board/upload',
        data
      );
      return response.data;
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


export default boardService;
