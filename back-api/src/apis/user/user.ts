import { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기
import getTokenSet from '../../utils/jwt';
import bcrypt from 'bcrypt';

const dbUrl = process.env.DB_HOST || 'http://localhost:3002';

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

      const isValid = await bcrypt.compare(userPw, userDb.hashedPw);

      // bcrypt.compare는 비동기 함수이므로
      // await를 사용하여 비교 결과를 기다려야 함.

      console.log("isValid: " + isValid)

      if (isValid) {
        const [accessToken, refreshToken] = getTokenSet(userId, userPw);

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
          userId,
          username: userDb.username,
          profileImg: userDb.profileImg,
          address: userDb.address,
          data: {
            accessToken,
            refreshToken,
          },
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
      userId,
      hashedPw,
      username,
      phone,
      address
    });

    res.status(200).json({ data: userId });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {

    // 토큰 삭제
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.get('/user', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query as { userId: string }; // ✅ query에서 추출

  console.log("GET '/user':", userId);

  try {
    // 데이터를 가져옴
    const response = await api.get(`${dbUrl}/users`, { params: { userId } }); // /items로 요청 (baseURL 자동 적용)

    // 해당 ID가 있는지 먼저 확인.
    if (response.data[0]) {
      const userDb = response.data[0];
      const data = {
        userId: userDb.userId,
        username: userDb.username,
        phone: userDb.phone,
        profileImg: userDb.profileImg,
        address: userDb.address
      }

      console.log('========= userDb ===========');
      console.log(userDb);
      console.log('========= // userDb ===========');
      res.json({
        data,
      });
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
    return;
  }
});

router.get('/user/check', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query as { userId: string }; // ✅ query에서 추출

  console.log("method: 'GET', url: '/user/check', param:", userId);

  try {
    // 데이터를 가져옴
    const response = await api.get(`${dbUrl}/users`, { params: { userId } }); // /items로 요청 (baseURL 자동 적용)

    // 해당 ID가 있는지 먼저 확인.
    // 존재하면 true, 없으면 false 반환
    const isExist = response.data[0] ? false : true;

    res.status(200).json({
      result: isExist,
    });
    
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
    return;
  }
});

router.post(
  '/user/edit',
  async (req: Request, res: Response): Promise<void> => {
    const { userId, username, phone, address } = req.body;

    console.log("method: 'POST', url: '/user/edit', param:", req.body);

    try {
      const dbUser = await api.get(`${dbUrl}/users`, {
        params: { userId },
      });

      const userList = dbUser.data;

      if (userList.length === 0) {
        res
          .status(404)
          .json({ message: '해당 사용자가 없습니다.', data: res });
      }

      const userIdInDb = userList[0].id;

      const updateRes = await api.patch(`${dbUrl}/users/${userIdInDb}`, {
        userId,
        username,
        phone,
        address,
      });

      res
        .status(200)
        .json({
          message: '사용자 정보가 변경되었습니다.',
          data: updateRes.data,
        });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  }
);

export default router;
