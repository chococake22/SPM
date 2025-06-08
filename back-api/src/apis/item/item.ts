import express, { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기


const dbUrl = process.env.DB_URL || 'http://localhost:3002';


const router = Router();

router.get('/list', async (req: Request, res: Response) => {
  const { offset, limit } = req.query as {
    offset: string;
    limit: string;
  };
  try {
    // 4개만 가져오도록
    const response = await api.get(`${dbUrl}/items?_start=${offset}&_limit=${limit}`); // /items로 요청 (baseURL 자동 적용)
    const data = response.data;
    res.status(200).json({ message:'데이터를 가져왔습니다.', data: data, status: 200, success: true});
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.get('/user-list', async (req: Request, res: Response) => {
  const { username, offset, limit } = req.query as {
    username: string;
    offset: string;
    limit: string;
  };
  try {
    // 4개만 가져오도록
    const response = await api.get(
      `${dbUrl}/items?_start=${offset}&_limit=${limit}`, { params: { username }}
    ); // /items로 요청 (baseURL 자동 적용)

    const data = response.data;
    res
      .status(200)
      .json({
        message: '데이터를 가져왔습니다.',
        data: data,
        status: 200,
        success: true,
      });

  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

export default router;
