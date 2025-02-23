import express from 'express';
import cors from 'cors';
import auth from '../src/apis/auth/auth'; // 라우트 파일 가져오기


const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // 허용할 도메인
    methods: ['GET', 'POST'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  })
);

app.use(express.json());

// 라우트 등록
app.use('/api', auth); // '/api' 경로에 라우트 적용

const port = 3001;

app.listen(port, () => {
  console.log(`Server On!!! Port: ${port}`);
});

export default app;