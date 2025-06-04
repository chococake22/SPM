import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
dotenv.config({
  path: path.resolve(__dirname, `../../.env.${env}`),
});

console.log("env: " + env)

const secretKey = process.env.JWT_SECRET as string;

console.log('secretKey: ' + secretKey);

// 액세스 토큰 발급
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, secretKey, { expiresIn: '20m' });
};

// 리프레시 토큰 발급
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, secretKey, { expiresIn: '7d' });
};

// 토큰 검증
export const verifyToken = (token: string) => {
  return jwt.verify(token, secretKey);
};

// 토큰 디코딩
export const decodeToken = (token: string) => {
  return jwt.decode(token);
};