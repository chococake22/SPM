import { Router, Request, Response } from 'express';
import api from '../../../../web/src/lib/axios'; // Axios 인스턴스 가져오기
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';

const dbUrl = process.env.DB_HOST || 'http://localhost:3002';

const router = Router();

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    // 토큰 삭제
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('userInfo');

    res.status(200).json({ message: '로그아웃이 되었습니다.' });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.get('/info', async (req: Request, res: Response): Promise<void> => {
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

router.post(
  '/edit',
  async (req: Request, res: Response): Promise<void> => {
    const { userId, username, phone, address } = req.body;

    console.log("method: 'POST', url: '/user/edit'");
    console.log("userId: " + userId);
    console.log('username: ' + username);
    console.log('phone: ' + phone);
    console.log('address: ' + address);

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

router.patch('/edit/change-pwd', async (req: Request, res: Response): Promise<void> => {
  const { userId, nowPwd, newPwd, newPwdConfirm } = req.body;

  console.log("post, '/change-pwd': " + nowPwd + ', ' + newPwd);

  try {
    // 데이터를 가져옴
    const dbUser = await api.get(`${dbUrl}/users`, { params: { userId } }); 
    const userList = dbUser.data;
    const id = userList[0].id;

    // 해당 ID가 있는지 먼저 확인.
    if (id) {
      const userDb = userList[0];

      const comparePwd = await bcrypt.compare(nowPwd, userDb.userPw);

      if (!comparePwd) {
        res.status(400).json({
          message: '현재 비밀번호가 틀렸습니다.',
        });
        return;
      }

      const saltRounds = 10;
      const newHashedPw = await bcrypt.hash(newPwd, saltRounds);

      console.log('비교: ' + nowPwd === newPwd);
      console.log('nowPwd: ' + nowPwd);
      console.log('newPwd: ' + newPwd);

      if (nowPwd === newPwd) {
        res.status(400).json({
          message: '현재와 동일한 비밀번호를 사용할 수 없습니다.',
        });
        return;
      }

      // 비밀번호 변경
      const updateRes = await api.patch(`${dbUrl}/users/${id}`, {
        userPw: newHashedPw,
      });

      res.status(200).json({
        message: '비밀번호가 변경되었습니다.',
        data: updateRes.data,
      });
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

export default router;
