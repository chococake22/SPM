import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const url = config.url || '';

    if (url.endsWith('/login') || url.endsWith('/signup')) {
      return config;
    }

    const token = localStorage.getItem('accessToken');

    if (token) {
      // 여기서 config.headers가 undefined일 수도 있으니 초기화 해주기
      config.headers = config.headers ?? {};

      // 타입스크립트 에러 방지를 위해 as any 단언
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
