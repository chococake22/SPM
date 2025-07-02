import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import jwt from 'jsonwebtoken';
import { logRequest, logResponse, logError } from '../../utils/logger';

const dbUrl = process.env.DB_URL || 'http://localhost:3002';
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';;

const router = Router();

router.get('/list', async (req: Request, res: Response) => {
  const { offset, limit } = req.query as {
    offset: string;
    limit: string;
  };

  logRequest('GET', '/api/board/list', { offset, limit });
  try {
    // 정해진 개수만 가져오도록
    const response = await api.get(`${dbUrl}/boards?_start=${offset}&_limit=${limit}`); // /items로 요청 (baseURL 자동 적용)
    const total = await api.get(`${dbUrl}/boards`);
    const data = {
      list: response.data,
      totalCount: total.data.length,
    };

    logResponse('GET', '/api/board/list', 200, { offset, limit });
    res.status(200).json({ message:'데이터를 가져왔습니다.', data: data, status: 200, success: true});
  } catch (error) {
    logError('GET', '/api/board/list', error, { offset, limit });
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

router.get('/detail', async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };

  logRequest('GET', '/api/board/detail', { id });

  try {
    // 4개만 가져오도록
    const response = await api.get(
      `${dbUrl}/boards/${id}`
    ); // /items로 요청 (baseURL 자동 적용)

    const data = response.data;

    logResponse('GET', '/api/board/detail', 200, { id });

    res
      .status(200)
      .json({
        message: '데이터를 가져왔습니다.',
        data: data,
        status: 200,
        success: true,
      });
  } catch (error) {
    logError('GET', '/api/board/detail', error, { id });
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

router.post('/upload', async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;

  logRequest('POST', '/api/board/upload', { title, content });
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      logResponse('POST', '/api/board/upload', 401, { title, content });
      res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }
    let decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      [key: string]: any;
    };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        username: string;
      };
    } catch (err) {
      logResponse('POST', '/api/board/upload', 403, { title, content });
      res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    const now = new Date();
    const formattedNow = formatDateToYMDHMS(now);

    logResponse('POST', '/api/board/upload', 200, { title, content });

    const response = await api.post(`${dbUrl}/boards`, {
      username: decoded.username,
      title: title,
      content: content,
      regiDttm: formattedNow,
      finalModDttm: formattedNow,
    });

    const data = response.data;
    const status = response.status;

    res.status(200).json({
      data: data,
      message: '등록이 완료되었습니다.',
      status: status,
      success: true,
    });
  } catch (error) {
    logError('POST', '/api/board/upload', error, { title, content });
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

function formatDateToYMDHMS(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export default router;
