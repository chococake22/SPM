import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL, // .env 파일의 API URL 사용
});

export default api;
