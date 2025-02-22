import express, { Request, Response } from 'express';
import cors from 'cors';  // CORS 미들웨어 임포트

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // 허용할 도메인
    methods: ['GET', 'POST'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  })
);

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
const port: number = 3010;

app.listen(port, () => console.log(`Server On!!! Port: ${port}`));
