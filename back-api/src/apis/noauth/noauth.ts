import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';
import axios, { AxiosError } from 'axios';
import { logRequest, logResponse, logError } from '../../utils/logger';

const dbUrl = process.env.DB_URL || 'http://localhost:3002';

const router = Router();

// auth.ts는 인증이 필요없는 api
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { userId, userPw } = req.body;

  logRequest('POST', '/api/login', { userId, userPw });

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
          id: userDb.id,
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


        logResponse('POST', '/api/login', 200, { userId: userDb.userId, username: userDb.username });

        res.json({
          message: '로그인에 성공했습니다.',
          status: 200,
          success: true,
          data: {
            id: userDb.id,
            userId: userDb.userId,
            username: userDb.username,
            phone: userDb.phone,
            address: userDb.address,
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
          message: '비밀번호가 틀렸습니다.',
          status: 400,
          success: false,
        });
      return;
      
    } else {
      logResponse('POST', '/api/login', 404, {
        userId,
        error: 'User not found',
      });

      res.status(404).json({
        message: '존재하지 않는 아이디입니다.',
        status: 404,
        success: false,
      });
      return;
    }
  } catch (error) {
    logError('POST', '/api/login', error, { userId });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      res.status(status).json({
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    } else {
      // axios 에러가 아닐 때
      res
        .status(500)
        .json({
          message: '서버 오류가 발생했습니다.',
          status: 500,
          success: false,
        });
    }
  }
});

router.post('/signup', async (req: Request, res: Response): Promise<void> => {  
  const { userId, userPw, username, phone, address } = req.body; 

  logRequest('POST', '/api/signup', { userId, userPw, username, phone, address });

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

    logResponse('POST', '/api/signup', 201, {
      userId,
      username,
      phone,
      address,
    });

    res
      .status(201)
      .json({
        data: data,
        message: '가입이 완료되었습니다.',
        status: status,
        success: true,
      });
  } catch (error) {
    logError('POST', '/api/signup', error, {
      userId,
      username,
      phone,
      address,
    });
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      res.status(status).json({
        data: null,
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    } else {
      // axios 에러가 아닐 때
      res.status(500).json({
        data: null,
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
});

router.get(
  '/check/user',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query as { userId: string }; // ✅ query에서 추출

    logRequest('GET', '/api/check/user', {
      userId
    });


    try {
      // 데이터를 가져옴
      const response = await api.get(`${dbUrl}/users`, { params: { userId } }); // /items로 요청 (baseURL 자동 적용)
      if (!response.data[0]) {

        logResponse('POST', '/api/check/user', 200, {
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

        logResponse('POST', '/api/check/user', 400, {
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
      logError('POST', '/api/check/user', error, {
        userId
      });

      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        res.status(status).json({
          message: '서버 오류가 발생했습니다.',
          status: 500,
          success: false,
        });
      } else {
        // axios 에러가 아닐 때
        res.status(500).json({
          message: '서버 오류가 발생했습니다.',
          status: 500,
          success: false,
        });
      }
    }
  }
);

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
    logError('POST', '/api/logout', error, {userId});
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      res.status(status).json({
        data: null,
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    } else {
      // axios 에러가 아닐 때
      res.status(500).json({
        data: null,
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
});

export default router;
