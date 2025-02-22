import dotenv from 'dotenv';

// .env 파일을 로드합니다
dotenv.config();

// 환경 변수 사용 예시
console.log(process.env.REACT_APP_API_URL); // http://localhost:3001
