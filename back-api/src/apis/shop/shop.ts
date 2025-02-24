import express, { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기

const router = Router();

router.post('/getItemList', async (req: Request, res: Response) => {
  try {
    const response = await api.get('http://localhost:3002/items'); // /items로 요청 (baseURL 자동 적용)
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

export default router;
