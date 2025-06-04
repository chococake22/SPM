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

// env로 빼기
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://183.101.164.221:3000',
      'http://www.informationmst.com:3000',
      'http://114.207.245.151:3000',
    ], // 허용할 도메인
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
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

app.listen(port, () => console.log(`Server On!!! Port: ${port}`));
