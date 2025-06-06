import express, { Request, Response } from 'express';
import cors from 'cors';  // CORS 미들웨어 임포트
import item from "./apis/item/item"
import user from '../src/apis/user/user';
import noauth from './apis/noauth/noauth';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { verifyAccessToken } from './apis/common/authRouter';
import path from 'path';
import swaggerUi from 'swagger-ui-express'; //ui 설정할 수 있는 모듈 불러오기
import fs from 'fs';
import * as yaml from 'js-yaml';
// const swaggerDocument = yaml.load('./swagger/openapi.yaml');

const app = express();
const env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.resolve(__dirname, `../.env.${env}`),
});

// swagger 설정
const swaggerFile = path.resolve(__dirname, '../dist/swagger-bundled.yaml');
const swaggerDocument = fs.readFileSync(swaggerFile, 'utf8');
const swaggerObj = yaml.load(swaggerDocument);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerObj as object));

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

app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

// 인증이 필요 없는 라우터 먼저 설정
app.use('/api', noauth); // /api/login, /api/signup 등

// 인증이 필요한 라우터는 미들웨어로 감싸기
app.use('/api/item', verifyAccessToken, item);
app.use('/api/user', verifyAccessToken, user);

// port 번호
const port: number = 3001;

app.listen(port, () =>
  console.log(`Server On!!! ENV: ${env},  Port: ${port} `)
);
