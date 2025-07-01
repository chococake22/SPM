import api from '@/lib/axios';
import { ItemListResponse  } from '@/types/item/type';
import { BoardDetailResponse, BoardListResponse, UploadBoardRequest, UploadBoardResponse } from '@/types/board/type';
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

  async getBoardDetail(id: string): Promise<BoardDetailResponse | undefined> {
    try {
      const response = await api.get<BoardDetailResponse>(`/api/board/detail/${id}`);
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

  async uploadBoard(data: UploadBoardRequest): Promise<UploadBoardResponse> {
    try {
      const response = await api.post<UploadBoardResponse>(
        '/api/board/upload',
        data
      );
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


export default boardService;
