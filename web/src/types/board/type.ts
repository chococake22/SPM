export interface BoardListResponse {
  data: BoardData;
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
  regiDttm: string;
  finalModDttm: string;
}

export interface UploadBoardRequest {
  title: string;
  content: string;
}

export interface UploadBoardResponse {
  success:boolean;
  message:string;
}
