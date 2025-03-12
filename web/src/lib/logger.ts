// lib/logger.ts
import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(), // 타임스탬프 추가
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// 로거 설정
const logger = winston.createLogger({
  level: 'info', // 기본 로그 레벨
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // 콘솔에서 컬러로 출력
        logFormat // 커스텀 포맷 적용
      ),
    }),
    new winston.transports.File({
      filename: 'logs/app.log', // 로그 파일에 저장
      format: logFormat,
    }),
  ],
});

// 다양한 로그 레벨로 로그 출력
logger.info('정보 로그');
logger.warn('경고 로그');
logger.error('오류 로그');
logger.debug('디버깅 로그');

export default logger;
