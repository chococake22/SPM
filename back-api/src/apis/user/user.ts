import express, { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기
import getTokenSet from '../../utils/jwt';

const apiUrl = process.env.DB_HOST || 'http://localhost:3002';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {  
  const { userId, userPw } = req.body; 

  try {
    const response = await api.get(`${apiUrl}/users`); // /items로 요청 (baseURL 자동 적용)
    const userIdDb = response.data.find(
      (item: { userId: string }) => item.userId === userId
    );
    const userPwDb = response.data.find(
      (item: { userPw: string }) => item.userPw === userPw
    );

    if (userIdDb && userPwDb) {
      const [accessToken, refreshToken] = getTokenSet(userId, userIdDb);
      res.json({
        userId,
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      res.status(404);
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

export default router;
