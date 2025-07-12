export interface BoardListResponse {
  data?: BoardData | null;
  success: boolean;
  message: string;
  status: number;
}

export interface BoardData {
  list: Board[] | undefined;
  totalCount: number | 0;
}

export interface Board {
  id: number;
  username: string;
  title: string;
  content: string;
  regiId: string;
  regiDttm: string;
  finalModId: string;
  finalModDttm: string;
  user: {
    userId: string;
    username: string;
  };
}

export interface UploadBoardRequest {
  title: string;
  content: string;
}

export interface UploadBoardResponse {
  data?: Board | null;
  status: number;
  success: boolean;
  message: string;
}

export interface BoardDetailResponse {
  data?: Board | null;
  status: number;
  success: boolean;
  message: string;
}
