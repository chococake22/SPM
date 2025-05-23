import express, { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기

const dbUrl = process.env.DB_URL || 'http://localhost:3002';

const router = Router();

router.post('/getItemList', async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.body;

    console.log("offset: " + offset)
    console.log('limit: ' + limit);

    // 4개만 가져오도록
    const response = await api.get(`${dbUrl}/items?_start=${offset}&_limit=${limit}`); // /items로 요청 (baseURL 자동 적용)

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.get('/getUserItemList', async (req: Request, res: Response) => {
  const { username, offset, limit } = req.query as {
    username: string;
    offset: string;
    limit: string;
  };
  try {

    console.log('/getUserItemList');
    console.log('username: ' + username);
    

    // 4개만 가져오도록
    const response = await api.get(
      `${dbUrl}/items?_start=${offset}&_limit=${limit}`, { params: { username }}
    ); // /items로 요청 (baseURL 자동 적용)

    console.log("========= /getUserItemList")
    console.log(response);
    console.log('=========//  /getUserItemList');

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

export default router;
