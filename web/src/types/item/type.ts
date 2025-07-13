export interface ItemListResponse {
  data: result | null;
  success: boolean;
  message: string;
  status: number;
}

export interface result {
  list: Item[];
  totalCount: number;
}

export interface Item {
  imageInfo: string;
  username: string;
  userId?: string;
  profileImg: string;
  itemImg: string;
  heartCnt: string;
  commentCnt: string;
  title: string;
  description: string;
  id: string;
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
