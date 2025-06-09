// src/lib/axios.ts
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV || 'development'}`
  ),
});

const apiUrl = process.env.API_URL; // .env에서 API_URL 가져오기

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
