import express, { Request, Response } from 'express';
import cors from 'cors';  // CORS 미들웨어 임포트
import item from "./apis/item/item"
import user from '../src/apis/user/user';
import auth from '../src/apis/auth/auth';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { verifyAccessToken } from './apis/common/authRouter';

dotenv.config();
const app = express();

const allowedOrigins = (process.env.WHITE_LIST || '')
  .split(',')
  .map((origin) => origin.trim());

// origin 옵션에 배열 넣으면 정확히 이 리스트만 허용됩니다.
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

// 인증이 필요 없는 라우터 먼저 설정
app.use('/api', auth); // /api/login, /api/signup 등

// 인증이 필요한 라우터는 미들웨어로 감싸기
app.use('/api/item', verifyAccessToken, item);
app.use('/api/user', verifyAccessToken, user);

// port 번호
const port: number = 3001;
const env = process.env.NODE_ENV || 'dev';

app.listen(port, () =>
  console.log(`Server On!!! ENV: ${env},  Port: ${port} `)
);
