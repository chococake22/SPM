export interface ItemListResponse {
  data: Item[]
}

export interface Item {
  imageInfo: string;
  username: string;
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
  success:boolean;
  message:string;
}
