import winston from 'winston';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DailyRotateFile = require('winston-daily-rotate-file');
import path from 'path';

const logDir = path.join(__dirname, '../../logs');

// 민감한 정보 마스킹 함수
const maskSensitiveData = (data: any): any => {

  if (typeof data === 'object' && data !== null) {
    const masked = { ...data };
    // 민감한 항목 정리, 해당 필드는 로그에 표기되지 않음
    const sensitiveFields = [
      'password',
      'userPw',
      'token',
      'accessToken',
      'refreshToken',
    ];

    sensitiveFields.forEach((field) => {
      if (masked[field]) {
        masked[field] = '***';
      }
    });
    return masked;
  }
  return data;
};

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const maskedMeta = maskSensitiveData(meta);
      const metaStr = Object.keys(maskedMeta).length
        ? `\n${JSON.stringify(maskedMeta, null, 2)}`
        : '';
      return `${timestamp} [ ${level.toUpperCase()} ] ▶ ${message}${metaStr}`;
    })
  ),
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const maskedMeta = maskSensitiveData(meta);
          const metaStr = Object.keys(maskedMeta).length
            ? `\n${JSON.stringify(maskedMeta, null, 2)}`
            : '';
          return `${timestamp} [ ${level} ] ▶ ${message}${metaStr}`;
        })
      ),
    }),
    // 에러 로그
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    // 전체 로그
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
});

// 로그 헬퍼 함수들
export const logRequest = (method: string, path: string, data?: any) => {
  logger.info('API Request', {
    method,
    path,
    data: maskSensitiveData(data),
    timestamp: new Date().toISOString()
  });
};

export const logResponse = (method: string, path: string, status: number, data?: any) => {
  logger.info('API Response', {
    method,
    path,
    status,
    data: maskSensitiveData(data),
    timestamp: new Date().toISOString()
  });
};

export const logError = (method: string, path: string, error: any, data?: any) => {
  logger.error('API Error', {
    method,
    path,
    error: error.message,
    stack: error.stack,
    data: maskSensitiveData(data),
    timestamp: new Date().toISOString()
  });
};

export default logger;
