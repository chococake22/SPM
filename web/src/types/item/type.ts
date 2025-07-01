export interface ItemListResponse {
  data?: Item[] | null;
  success: boolean;
  message: string;
  status: number;
}

export interface Item {
  imageInfo: string;
  username: string;
  userId?: string;
  profileImg: string;
  itemImg: string;
  heartCnt: string;
  commentCnt: string;
  itemName: string;
  description: string;
  id: number;
}

export interface UploadItemRequest {
  image: string;
  itemName: string;
  description: string;
}

export interface UploadItemResponse {
  data?: Item | null;
  success:boolean;
  message:string;
  status: number;
}
