import express, { Request, Response } from 'express';
import cors from 'cors';  // CORS 미들웨어 임포트
import shop from "../src/apis/shop/shop"
import user from '../src/apis/user/user';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:3000'] , // 허용할 도메인
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
    credentials: true,
  })
);



// app에 router를 추가하기
app.use('/api', shop);
app.use('/api', user);

// port 번호
const port: number = 3001;

app.listen(port, () => console.log(`Server On!!! Port: ${port}`));
