import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';
import axios, { AxiosError } from 'axios';
import { logRequest, logResponse, logError } from '../../utils/logger';
import prisma from '../../lib/prisma';


const dbUrl = process.env.DB_URL || 'http://localhost:3002';

const router = Router();

// auth.ts는 인증이 필요없는 api
// ... existing code ...
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { userId, userPw } = req.body;

  logRequest('POST', '/api/login', { userId, userPw });

  try {
    // Prisma로 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        userPw: true,
        username: true,
        phone: true,
        address: true,
        profileImg: true,
      },
    });
    
    if (!user) {
      logResponse('POST', '/api/login', 404, {
        userId,
        error: '존재하지 않는 아이디입니다.',
      });

      res.status(404).json({
        data: null,
        message: '존재하지 않는 아이디입니다.',
        status: 404,
        success: false,
      });
      return;
    }

    // 비밀번호 확인
    const isValid = await bcrypt.compare(userPw, user.userPw);

    if (isValid) {
      const params = {
        userId: user.userId,
        username: user.username,
        phone: user.phone,
        address: user.address,
        id: user.id,
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

      logResponse('POST', '/api/login', 200, { userId: user.userId, username: user.username });

      res.json({
        message: '로그인에 성공했습니다.',
        status: 200,
        success: true,
        data: {
          id: user.id,
          userId: user.userId,
          username: user.username,
          phone: user.phone,
          address: user.address,
          profileImg: user.profileImg,
          tokens: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        },
      });
      return;
    }

    logResponse('POST', '/api/login', 400, { userId, error: 'Invalid password' });
    
    res
      .status(400)
      .json({
        data: null,
        message: '아이디나 비밀번호가 틀렸습니다.',
        status: 400,
        success: false,
      });
    return;
      
  } catch (error: any) {
    logError('POST', '/api/login', error, '서버 에러가 발생했습니다.', { userId });

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});
// ... existing code ...

router.post('/signup', async (req: Request, res: Response): Promise<void> => {  
  const { userId, userPw, username, phone, address } = req.body; 

  logRequest('POST', '/api/signup', { userId, userPw, username, phone, address });

  try {
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(userPw, saltRounds);

    // Prisma로 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        userId: userId,
        userPw: hashedPw,
        username: username,
        phone: phone,
        address: address,
        regiId: userId,
        regiDttm: new Date(),
        finalModId: userId,
        finalModDttm: new Date(),
      },
      select: {
        id: true,
        userId: true,
        username: true,
        phone: true,
        address: true,
        profileImg: true,
      },
    });

    logResponse('POST', '/api/signup', 201, {
      userId,
      username,
      phone,
      address,
    });

    res.status(201).json({
      data: newUser,
      message: '가입이 완료되었습니다.',
      status: 201,
      success: true,
    });
  } catch (error) {
    logError('POST', '/api/signup', error, '서버 에러가 발생했습니다.', {
      userId,
      username,
      phone,
      address,
    });
    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

// ... existing code ...
router.get(
  '/check/user',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query as { userId: string };

    logRequest('GET', '/api/check/user', {
      userId
    });

    try {
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
        logResponse('GET', '/api/check/user', 200, {
          userId
        });

        res.status(200).json({
          data: {
            userId: req.query.userId || '',
          },
          message: '사용할 수 있는 아이디입니다.',
          status: 200,
          success: true,
        }); 
      } else {
        logResponse('GET', '/api/check/user', 400, {
          userId
        });

        res.status(400).json({
          data: null,
          message: '이미 있는 아이디입니다.',
          status: 400,
          success: false,
        });
      }

    } catch (error) {
      logError('GET', '/api/check/user', error, '서버 에러가 발생했습니다.', {
        userId
      });

      res.status(500).json({
        data: null,
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
);
// ... existing code ...

router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  logRequest('POST', '/api/logout', {userId});

  try {
    // 토큰 삭제
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    logResponse('POST', '/api/logout', 200, {userId});

    res.status(200).json({ data: {userId}, message: '로그아웃이 되었습니다.', status: 200, success:true });
  } catch (error) {
    logError('POST', '/api/logout', error, '서버 에러가 발생했습니다.', {userId});
    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

export default router;
