import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import bcrypt from 'bcrypt';
import upload from '../../utils/upload';

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
        address: userDb.address
      }

      res.status(200).json({
        data: data,
        message: "사용자 정보를 가져왔습니다.",
        status: 200,
        success: true
      });
    } else {
      res.status(400).json({
        message: '해당 사용자가 없습니다',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: '서버 에러가 발생했습니다.',
      status: 200,
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

    console.log("method: 'PUT', url: '/user/edit'");
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
        res.status(404).json({
          message: '해당 사용자가 없습니다.',
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

      res.status(200).json({
        data: data,
        message: '사용자 정보가 변경되었습니다.',
        status: 200,
        success: true,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        message: '서버 에러가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
);

router.patch('/edit/pwd', async (req: Request, res: Response): Promise<void> => {
  const { userId, nowPwd, newPwd, newPwdConfirm } = req.body;

  console.log("patch, '/edit/pwd': " + nowPwd + ', ' + newPwd);

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
          status: 400,
          success: false,
        });
        return;
      }

      const saltRounds = 10;
      const newHashedPw = await bcrypt.hash(newPwd, saltRounds);

      if (nowPwd === newPwd) {
        res.status(400).json({
          message: '현재와 동일한 비밀번호를 사용할 수 없습니다.',
          status: 400,
          success: false,
        });
        return;
      }

      // 비밀번호 변경
      const updateRes = await api.patch(`${dbUrl}/users/${id}`, {
        userPw: newHashedPw,
      });

      const data = {
        userId: userId,
      };

      res.status(200).json({
        message: '비밀번호가 변경되었습니다.',
        data: data,
        status: 200,
        success: true,
      });
      return;
    } else {
      res.status(404).json({
        message: '존재하지 않는 아이디입니다.',
        status: 404,
        success: false,
      });
      return;
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    res
      .status(500)
      .json({ message: 'Error fetching items', status: 500, success: false });
    return;
  }
});


router.patch(
  '/edit/img',
  upload.single('profile'),
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    const file = (req as MulterRequest).file;

    console.log('userId:', userId);
    console.log('file:', file?.originalname, file?.mimetype);

    if (!file) {
      res.status(400).json({ message: '파일이 없습니다.', success: false });
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

        res.status(200).json({
          message: '프로필 이미지가 변경되었습니다.',
          data: data,
          status: 200,
          success: true,
        });
        return;
      } else {
        res.status(404).json({
          message: '존재하지 않는 아이디입니다.',
          status: 404,
          success: false,
        });
        return;
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      res
        .status(500)
        .json({ message: 'Error fetching items', status: 500, success: false });
      return;
    }
  }
);


router.get('/img', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query as { userId: string }; // ✅ query에서 추출

  console.log("GET '/img':", userId);

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

      res.status(200).json({
        data: data,
        message: '프로필 이미지 정보를 가져왔습니다.',
        status: 200,
        success: true,
      });
    } else {
      res.status(400).json({
        message: '해당 사용자가 없습니다',
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: '서버 에러가 발생했습니다.',
      status: 200,
      success: true,
    });
    return;
  }
});

export default router;
