// redis.ts
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// 환경 변수로부터 REDIS_PORT 값을 가져오며 기본값 설정
const redisPort: number = parseInt(process.env.REDIS_PORT || '6379', 10);

// redis 클라이언트 생성
const redisClient: RedisClientType = createClient({
  url: `redis://localhost:${redisPort}`,
});

// 클라이언트 연결
redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient
  .connect()
  .catch((err) => console.error('Failed to connect to Redis:', err));

export default redisClient;
