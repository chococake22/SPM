// src/lib/axios.ts
import axios from 'axios';

const apiUrl = process.env.API_URL; // .env에서 API_URL 가져오기

console.log(apiUrl);

if (!apiUrl) {
  throw new Error('API_URL is not defined in .env');
}

const api = axios.create({
  baseURL: apiUrl, // 기본 baseURL 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
