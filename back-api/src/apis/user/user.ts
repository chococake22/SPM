import express, { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기
import getTokenSet from '../../utils/jwt';
import bcrypt from 'bcrypt';

const apiUrl = process.env.DB_HOST || 'http://localhost:3002';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { userId, userPw } = req.body;
  try {
    const response = await api.get(`${apiUrl}/users`); // /items로 요청 (baseURL 자동 적용)

    console.log(response.data)

    const userIdDb = response.data.find(
      (item: { userId: string }) => item.userId === userId
    );

    // bcrypt.compare는 비동기 함수이므로
    // await를 사용하여 비교 결과를 기다려야 함.
    const isValid = await bcrypt.compare(userPw, userIdDb.hashedPw);

    if (userIdDb && isValid) {
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


router.post('/signup', async (req: Request, res: Response): Promise<void> => {  
  const { userId, userPw, username, phone } = req.body; 

  try {
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(userPw, saltRounds);

    const response = await api.post(`${apiUrl}/users`, {
      userId,
      hashedPw,
      username,
      phone,
    });

    res.status(200);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

export default router;
