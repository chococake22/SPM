import { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';

const dbUrl = process.env.DB_URL || 'http://localhost:3002';

const router = Router();


router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { userId, userPw } = req.body;

  console.log("post, '/login': " + userId + ', ' + userPw);

  try {
    // 데이터를 가져옴
    const response = await api.get(`${dbUrl}/users`, { params: { userId } }); // /items로 요청 (baseURL 자동 적용)
    
    // 해당 ID가 있는지 먼저 확인.
    if (response.data[0]) {
      const userDb = response.data[0];

      const isValid = await bcrypt.compare(userPw, userDb.userPw);

      // bcrypt.compare는 비동기 함수이므로
      // await를 사용하여 비교 결과를 기다려야 함.

      if (isValid) {
        const params = {
          userId: userDb.userId,
          username: userDb.username,
          phone: userDb.phone,
          address: userDb.address,
        };
        const accessToken = generateAccessToken(params);
        const refreshToken = generateRefreshToken(params);

        // access token을 httpOnly로 쿠키에 담아서 저장.
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });

        res.json({
          userId: userDb.userId,
          username: userDb.username,
          profileImg: userDb.profileImg,
          phone: userDb.phone,
          address: userDb.address,
        });
        return;
      } 
      
      res.status(404).json({ message: '비밀번호가 틀렸습니다.' });
      return;
      
    } else {
      res.status(404).json({ message: '존재하지 않는 아이디입니다.' });
      return;
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
    return;
  }
});


router.post('/signup', async (req: Request, res: Response): Promise<void> => {  
  const { userId, userPw, username, phone, address } = req.body; 

  try {
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(userPw, saltRounds);

    const response = await api.post(`${dbUrl}/users`, {
      userId: userId,
      userPw: hashedPw,
      username: username,
      phone: phone,
      address: address
    });

    const data = response.data;
    const status = response.status;

    res.status(200).json({ data: data, message: '가입이 완료되었습니다.', status: status });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.post('/token', async (req: Request, res: Response): Promise<void> => {
  const { userId, userPw } = req.body;
  try {
    // 데이터를 가져옴

        const refreshToken = req.header;

        console.log("ref: "+ refreshToken)

        if (!refreshToken) {
          res.status(401).json({ message: 'Refresh token missing' });
        }

        const params = {
          userId: userId,
        };

        const newAccessToken = generateAccessToken(params);
        const newRefreshToken = generateRefreshToken(params);

        // access token을 httpOnly로 쿠키에 담아서 저장.
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });

        res.status(200).json({
          data: {
            newAccessToken,
            newRefreshToken,
          },
        });
        return;
      
    
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
    return;
  }
});


router.get(
  '/check/user',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query as { userId: string }; // ✅ query에서 추출

    console.log("method: 'GET', url: '/check/user', param:", userId);

    try {
      // 데이터를 가져옴
      const response = await api.get(`${dbUrl}/users`, { params: { userId } }); // /items로 요청 (baseURL 자동 적용)
      const data = response.data[0]

      res.status(200).json({
        data: data,
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Error fetching items' });
      return;
    }
  }
);

export default router;
