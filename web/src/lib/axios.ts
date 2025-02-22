import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // 환경변수에서 URL을 가져옵니다.
});

export default api;
