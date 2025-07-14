import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import bcrypt from 'bcrypt';
import upload from '../../utils/upload';
import { logRequest, logResponse, logError } from '../../utils/logger';
import prisma from '../../lib/prisma';
import { producer } from '../../lib/kafka';


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
    const message = {
      userId: userId,
      api: '/api/user/info',
      date: new Date(),
    };

    await producer.send({
      topic: 'user-topic',
      messages: [
        {
          key: '/api/user/info',
          value: JSON.stringify(message),
        },
      ],
    });

    // Prisma로 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        username: true,
        phone: true,
        address: true,
        profileImg: true,
      },
    });

    if (user) {
      const data = {
        userId: user.userId,
        username: user.username,
        phone: user.phone,
        address: user.address,
        profileImg: user.profileImg,
      };

      logResponse('GET', '/api/user/info', 200, { userId });

      res.status(200).json({
        data: data,
        message: '사용자 정보를 가져왔습니다.',
        status: 200,
        success: true,
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
      const message = {
        userId: userId,
        username: username,
        phone: phone,
        address: address,
        api: '/api/user/edit',
        date: new Date(),
      };

      await producer.send({
        topic: 'user-topic',
        messages: [
          {
            key: '/api/user/edit',
            value: JSON.stringify(message),
          },
        ],
      });

      // Prisma로 사용자 정보 업데이트
      const updatedUser = await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          username: username,
          phone: phone,
          address: address,
          finalModId: userId,
          finalModDttm: new Date(),
        },
        select: {
          userId: true,
          username: true,
          phone: true,
          address: true,
          profileImg: true,
        },
      });

      const data = {
        userId: updatedUser.userId,
        username: updatedUser.username,
        phone: updatedUser.phone,
        address: updatedUser.address,
        profileImg: updatedUser.profileImg,
      };

      logResponse('PATCH', '/api/user/edit', 200, { userId });

      res.status(200).json({
        data: data,
        message: '사용자 정보가 변경되었습니다.',
        status: 200,
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

// ... existing code ...
router.patch('/edit/pwd', async (req: Request, res: Response): Promise<void> => {
  const { userId, nowPwd, newPwd, newPwdConfirm } = req.body;

  logRequest('PATCH', '/api/user/edit/pwd', { userId, nowPwd, newPwd, newPwdConfirm });

  try {

    const message = {
      userId: userId,
      nowPwd: nowPwd,
      newPwd: newPwd,
      newPwdConfirm: newPwdConfirm,
      api: '/api/user/edit/pwd',
      date: new Date(),
    };

    await producer.send({
      topic: 'user-topic',
      messages: [
        {
          key: '/api/user/edit/pwd',
          value: JSON.stringify(message),
        },
      ],
    });

    // Prisma로 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        userPw: true,
      },
    });

    if (!user) {
      logResponse('PATCH', '/api/user/edit/pwd', 404, { userId });

      res.status(404).json({
        data: null,
        message: '존재하지 않는 아이디입니다.',
        status: 404,
        success: false,
      });
      return;
    }

    // 현재 비밀번호 확인
    const comparePwd = await bcrypt.compare(nowPwd, user.userPw);

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

    // 새 비밀번호가 현재 비밀번호와 같은지 확인
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

    // 새 비밀번호 해시화
    const saltRounds = 10;
    const newHashedPw = await bcrypt.hash(newPwd, saltRounds);

    // Prisma로 비밀번호 업데이트
    await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        userPw: newHashedPw,
        finalModId: userId,
        finalModDttm: new Date(),
      },
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
  } catch (error) {
    logError('PATCH', '/api/user/edit/pwd', error, '서버 에러가 발생했습니다.', { userId, nowPwd, newPwd, newPwdConfirm });

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
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
      const message = {
        userId: userId,
        api: '/api/user/edit/img',
        date: new Date(),
      };

      await producer.send({
        topic: 'user-topic',
        messages: [
          {
            key: '/api/user/edit/img',
            value: JSON.stringify(message),
          },
        ],
      });

      // Prisma로 사용자 존재 여부 확인
      const user = await prisma.user.findUnique({
        where: {
          userId: userId,
        },
        select: {
          userId: true,
        },
      });

      if (!user) {
        logResponse('PATCH', '/api/user/edit/img', 404, { userId });
        res.status(404).json({
          message: '존재하지 않는 아이디입니다.',
          status: 404,
          success: false,
        });
        return;
      }

      const imagePath = file.filename;

      // Prisma로 프로필 이미지 업데이트
      await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          profileImg: '/' + imagePath,
          finalModId: userId,
          finalModDttm: new Date(),
        },
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
    } catch (error) {
      logError('PATCH', '/api/user/edit/img', error, '서버 에러가 발생했습니다.', { userId, file });
      res.status(500).json({
        data: null,
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
);


router.get('/img', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query as { userId: string };

  logRequest('GET', '/api/user/img', { userId });

  try {
    const message = {
      userId: userId,
      api: '/api/user/img',
      date: new Date(),
    };

    await producer.send({
      topic: 'user-topic',
      messages: [
        {
          key: '/api/user/img',
          value: JSON.stringify(message),
        },
      ],
    });

    // Prisma로 사용자 프로필 이미지 정보 가져오기
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        profileImg: true,
      },
    });

    if (user) {
      const data = {
        userId: user.userId,
        profileImg: user.profileImg,
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
      res.status(404).json({
        data: null,
        message: '존재하지 않는 아이디입니다.',
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    logError('GET', '/api/user/img', error, '서버 에러가 발생했습니다.', {
      userId,
    });

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
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

    // Prisma로 username으로 사용자 찾기
    const user = await prisma.user.findFirst({
      where: {
        username: decodedUsername,
      },
      select: {
        id: true,
        username: true,
        profileImg: true,
      },
    });

    console.log('user', user);

    if (user) {
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
    logError(
      'GET',
      '/api/user/find-by-username',
      error,
      '서버 에러가 발생했습니다.',
      { username }
    );

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

export default router;
