export interface BoardListResponse {
  data: Board[];
  totalCount: number;
}

export interface Board {
  title: string;
  content: string;
  regiDttm: string;
  finalModDttm: string;
  username: string;
  id: number;
}

export interface UploadBoardRequest {
  title: string;
  content: string;
}

export interface UploadBoardResponse {
  success:boolean;
  message:string;
}
