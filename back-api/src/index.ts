import express, { Request, Response } from 'express';
import cors from 'cors';  // CORS 미들웨어 임포트
import item from "./apis/item/item"
import user from './apis/user/user';
import board from './apis/board/board';
import noauth from './apis/noauth/noauth';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { verifyAccessToken } from './apis/common/authRouter';
import path from 'path';
import swaggerUi from 'swagger-ui-express'; //ui 설정할 수 있는 모듈 불러오기
import fs from 'fs';
import { connectKafka, disconnectKafka } from './lib/kafka';


const app = express();
const env = process.env.NODE_ENV || 'development';

// 환경변수 불러오기
dotenv.config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV || 'development'}`
  ),
});

const swaggerFile = path.resolve(__dirname, '../dist/swagger-bundled.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const allowedOrigins = process.env.WHITE_LIST;

console.log("allow: " + allowedOrigins)

// origin 옵션에 배열 넣으면 정확히 이 리스트만 허용됩니다.
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
  })
);

// 프로필 사진 이미지 불러오는 로컬에 있는 저장소
app.use(
  '/storage/profileImg',
  express.static(path.join(__dirname, '../../storage/profileImg'))
);

// 아이템 이미지 저장소
app.use(
  '/storage/itemImg',
  express.static(path.resolve(__dirname, '../../storage/itemImg'))
);


app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

// 인증이 필요 없는 라우터 먼저 설정
app.use('/api', noauth); // /api/login, /api/signup 등

// 인증이 필요한 라우터는 미들웨어로 감싸기
app.use('/api/item', verifyAccessToken, item);
app.use('/api/user', verifyAccessToken, user);
app.use('/api/board', verifyAccessToken, board);

// port 번호
const port: number = 3001;

app.listen(port, async () => {
  console.log(`Server On!!! ENV: ${env},  Port: ${port} `)
// 서버 시작 시 한 번만 Kafka 연결
  try {
    await connectKafka();
    console.log('Kafka connected on startup');
  } catch (error) {
    console.error('Failed to connect to Kafka on startup:', error);
  }
  // 서버 종료 시 Kafka 연결 해제
});

