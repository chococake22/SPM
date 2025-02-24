// web/src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002', // 기본 URL을 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
