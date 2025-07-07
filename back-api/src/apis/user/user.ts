import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import bcrypt from 'bcrypt';
import upload from '../../utils/upload';
import { logRequest, logResponse, logError } from '../../utils/logger';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const dbUrl = process.env.DB_URL || 'http://localhost:3002';
const router = Router();

/**
 * user/getUserInfo.yaml
 */
router.get('/info', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query as { userId: string }; // ✅ query에서 추출

  logRequest('GET', '/api/user/info', { userId });

  try {
    // 데이터를 가져옴
    const response = await api.get(`${dbUrl}/users`, { params: { userId } }); // /items로 요청 (baseURL 자동 적용)

    // 해당 ID가 있는지 먼저 확인.
    if (response.data.length > 0 && response.data[0]) {
      const userDb = response.data[0];
      const data = {
        userId: userDb.userId,
        username: userDb.username,
        phone: userDb.phone,
        address: userDb.address
      }

      logResponse('GET', '/api/user/info', 200, { userId });

      res.status(200).json({
        data: data,
        message: "사용자 정보를 가져왔습니다.",
        status: 200,
        success: true
      });
    } else {
      logResponse('GET', '/api/user/info', 404, { userId });

      res.status(404).json({
        data: null,
        message: '존재하지 않는 사용자입니다.',
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    logError('GET', '/api/user/info', error, '서버 에러가 발생했습니다.', { userId });

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: true,
    });
    return;
  }
});

/**
 * user/getUserInfo.yaml
 */
router.patch(
  '/edit',
  async (req: Request, res: Response): Promise<void> => {
    const { userId, username, phone, address } = req.body;

    logRequest('PATCH', '/api/user/edit', { userId, username, phone, address });

    try {
      const dbUser = await api.get(`${dbUrl}/users`, {
        params: { userId },
      });

      const userList = dbUser.data;

      if (userList.length === 0) {
        logResponse('PATCH', '/api/user/edit', 404, { userId });

        res.status(404).json({
          data: null,
          message: '존재하지 않는 사용자입니다.',
          status: 404,
          success: false,
        });
      }

      const id = userList[0].id;

      const updateRes = await api.patch(`${dbUrl}/users/${id}`, {
        userId,
        username,
        phone,
        address,
      });

      const data = {
        userId: updateRes.data.userId,
        username: updateRes.data.username,
        phone: updateRes.data.phone,
        address: updateRes.data.address
      };

      logResponse('PATCH', '/api/user/edit', 200, { userId });

      res.status(201).json({
        data: data,
        message: '사용자 정보가 변경되었습니다.',
        status: 201,
        success: true,
      });
    } catch (error) {
      logError('PATCH', '/api/user/edit', error, '서버 에러가 발생했습니다.', { userId, username, phone, address });
      res.status(500).json({
        data: null,
        message: '서버 에러가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
);

router.patch('/edit/pwd', async (req: Request, res: Response): Promise<void> => {
  const { userId, nowPwd, newPwd, newPwdConfirm } = req.body;

  logRequest('PATCH', '/api/user/edit/pwd', { userId, nowPwd, newPwd, newPwdConfirm });

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
        logResponse('PATCH', '/api/user/edit/pwd', 400, { userId });

        res.status(400).json({
          data: null,
          message: '현재 비밀번호가 잘못되었습니다.',
          status: 400,
          success: false,
        });
        return;
      }

      const saltRounds = 10;
      const newHashedPw = await bcrypt.hash(newPwd, saltRounds);

      if (nowPwd === newPwd) {
        logResponse('PATCH', '/api/user/edit/pwd', 400, { userId });

        res.status(400).json({
          data: null,
          message: '현재와 동일한 비밀번호를 사용할 수 없습니다.',
          status: 400,
          success: false,
        });
        return;
      }

      // 비밀번호 변경
      await api.patch(`${dbUrl}/users/${id}`, {
        userPw: newHashedPw,
      });

      const data = {
        userId: userId,
      };

      logResponse('PATCH', '/api/user/edit/pwd', 200, { userId });

      res.status(200).json({
        message: '비밀번호가 변경되었습니다.',
        data: data,
        status: 200,
        success: true,
      });
      return;
    } else {
      logResponse('PATCH', '/api/user/edit/pwd', 404, { userId });

      res.status(404).json({
        data: null,
        message: '존재하지 않는 아이디입니다.',
        status: 404,
        success: false,
      });
      return;
    }
  } catch (error) {
    logError('PATCH', '/api/user/edit/pwd', error, '서버 에러가 발생했습니다.', { userId, nowPwd, newPwd, newPwdConfirm });

    res.status(500).json({
      data: null,
      message: '서버 에러가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});


router.patch(
  '/edit/img',
  upload.single('profile'),
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    const file = (req as MulterRequest).file;

    logRequest('PATCH', '/api/user/edit/img', { userId, file });

    if (!file) {
      logResponse('PATCH', '/api/user/edit/img', 400, { userId });

      res.status(400).json({
        message: '파일이 없습니다.',
        data: null,
        status: 400,
        success: false,
      });
      return;
    }

    try {
      // 데이터를 가져옴
      const dbUser = await api.get(`${dbUrl}/users`, { params: { userId } });
      const userList = dbUser.data;
      const id = userList[0].id;

      // 해당 ID가 있는지 먼저 확인.
      if (id) {
        const imagePath = file.filename;
        const userDb = userList[0];

        const id = userDb.id;

        // 이미지 변경
        await api.patch(`${dbUrl}/users/${id}`, {
          profileImg: '/' + imagePath,
        });

        const data = {
          userId: userId,
        };

        logResponse('PATCH', '/api/user/edit/img', 200, { userId });

        res.status(200).json({
          message: '프로필 이미지가 변경되었습니다.',
          data: data,
          status: 200,
          success: true,
        });
        return;
      } else {
        logResponse('PATCH', '/api/user/edit/img', 404, { userId });
        res.status(404).json({
          message: '존재하지 않는 아이디입니다.',
          status: 404,
          success: false,
        });
        return;
      }
    } catch (error) {
      logError('PATCH', '/api/user/edit/img', error, '서버 에러가 발생했습니다.', { userId, file });
      res.status(500).json({
        data: null,
        message: '서버 에러가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
);


router.get('/img', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query as { userId: string }; // ✅ query에서 추출

  logRequest('GET', '/api/user/img', { userId });

  try {
    // 데이터를 가져옴
    const response = await api.get(`${dbUrl}/users`, { params: { userId } }); // /items로 요청 (baseURL 자동 적용)

    // 해당 ID가 있는지 먼저 확인.
    if (response.data[0]) {
      const userDb = response.data[0];
      const data = {
        userId: userDb.userId,
        profileImg: userDb.profileImg,
      };

      logResponse('GET', '/api/user/img', 200, { userId });

      res.status(200).json({
        data: data,
        message: '프로필 이미지 정보를 가져왔습니다.',
        status: 200,
        success: true,
      });
    } else {
      logResponse('GET', '/api/user/img', 404, { userId });
      res.status(400).json({
        data: null,
        message: '존재하지 않는 아이디입니다.',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    logError('GET', '/api/user/img', error, '서버 에러가 발생했습니다.', { userId });

    res.status(500).json({
      data: null,
      message: '서버 에러가 발생했습니다.',
      status: 500,
      success: true,
    });
    return;
  }
});

// username으로 사용자 id 찾기
router.get('/find-by-username', async (req: Request, res: Response) => {
  const { username } = req.query as { username: string };

  logRequest('GET', '/api/user/find-by-username/:username', { username });
  
  try {
    // URL 인코딩된 username 처리
    const decodedUsername = decodeURIComponent(username);

    // API 호출 방식 통일 (params 사용)
    const response = await api.get(`${dbUrl}/users`, {
      params: { username: decodedUsername },
    });
    const users = response.data;

    if (users && users.length > 0) {
      const user = users[0];

      logResponse('GET', '/api/user/find-by-username', 200, {
        username,
      });

      res.status(200).json({
        message: '사용자를 찾았습니다.',
        data: {
          id: user.id,
          username: user.username,
          profileImg: user.profileImg,
        },
        status: 200,
        success: true,
      });
    } else {
      logResponse('GET', '/api/user/find-by-username', 404, {
        username,
      });

      res.status(404).json({
        data: null,
        message: '존재하지 않는 사용자입니다.',
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    logError('GET', '/api/user/find-by-username', error, '서버 에러가 발생했습니다.', { username });  

    res.status(500).json({ 
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false 
    });
  }
});

export default router;
