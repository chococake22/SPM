import express, { Request, Response } from 'express';
import cors from 'cors';  // CORS 미들웨어 임포트
import axios from "../../web/src/lib/axios";
import shop from "../src/apis/shop/shop"
import user from '../src/apis/user/user';
import dotenv from 'dotenv';


dotenv.config();
const app = express();

app.use(express.json());

const apiUrl = process.env.DB_HOST || 'http://localhost:3002';

app.use(
  cors({
    origin: '*', // 허용할 도메인
    methods: ['GET', 'POST'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  })
);

app.use('/api', shop);
app.use('/api', user);

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello Typescript123');
});

app.get('/test', async (req: Request, res: Response) => {
  const data = {
    name: 'gjgjgj',
    age: '12',
  };
  res.json(data);
});




// port 번호
const port: number = 3001;

app.listen(port, () => console.log(`Server On!!! Port: ${port}`));
