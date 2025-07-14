import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';
import axios, { AxiosError } from 'axios';
import { logRequest, logResponse, logError } from '../../utils/logger';
import prisma from '../../lib/prisma';
import { connectKafka, consumeMessages, producer } from '../../lib/kafka';


const dbUrl = process.env.DB_URL || 'http://localhost:3002';

const router = Router();

// auth.ts는 인증이 필요없는 api
// ... existing code ...
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { userId, userPw } = req.body;

  logRequest('POST', '/api/login', { userId, userPw });

  try {

    const message = {
      userId: userId,
      api: 'login',
      date: new Date(),
    };

    await producer.send({
      topic: 'noauth-topic',
      messages: [
        {
          key: '/api/login',
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

    const message = {
      userId: userId,
      username: username,
      phone: phone,
      address: address,
      api: '/api/signup',
      date: new Date(),
    };

    await producer.send({
      topic: 'noauth-topic',
      messages: [
        {
          key: '/api/signup',
          value: JSON.stringify(message),
        },
      ],
    });

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
      const message = {
        userId: userId,
        api: '/api/check/user',
        date: new Date(),
      };

      await producer.send({
        topic: 'noauth-topic',
        messages: [
          {
            key: '/api/check/user',
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
    const message = {
      userId: userId,
      api: '/api/logout',
      date: new Date(),
    };

    await producer.send({
      topic: 'noauth-topic',
      messages: [
        {
          key: '/api/logout',
          value: JSON.stringify(message),
        },
      ],
    });

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


// Kafka 메시지 소비 API (인증 불필요)
router.get('/kafka/consume', async (req: Request, res: Response) => {
  const { topic = 'test-topic' } = req.query as { topic: string };
  
  logRequest('GET', '/api/kafka/consume', { topic });

  try {
    // Kafka 연결
    await connectKafka();
    
    // 메시지 소비 시작
    await consumeMessages(topic, async (message) => {
      console.log('Processing message:', message);
      
      try {
        // 메시지를 JSON으로 파싱 (메시지가 JSON 형식이라고 가정)
        const messageData = JSON.parse(message);
        
        // 메시지 데이터를 데이터베이스에 저장하거나 처리
        if (messageData.type === 'user_activity') {
          // 사용자 활동 메시지 처리
          console.log('User activity message received:', messageData);
          
          // 여기서 필요한 비즈니스 로직 처리
          // 예: 로그 저장, 알림 발송 등
        } else if (messageData.type === 'system_notification') {
          // 시스템 알림 메시지 처리
          console.log('System notification received:', messageData);
        }
        
      } catch (parseError) {
        console.error('Failed to parse message:', parseError);
      }
    });

    logResponse('GET', '/api/kafka/consume', 200, { topic });
    
    res.status(200).json({
      message: `Kafka consumer started for topic: ${topic}`,
      data: { topic },
      status: 200,
      success: true,
    });
    
  } catch (error) {
    logError('GET', '/api/kafka/consume', error, 'Kafka consumer failed', { topic });
    
    res.status(500).json({
      data: null,
      message: 'Kafka consumer failed',
      status: 500,
      success: false,
    });
  }
});

// Kafka 메시지 발행 API (테스트용, 인증 불필요)
router.post('/kafka/publish', async (req: Request, res: Response) => {
  const { topic = 'test-topic', message } = req.body;
  
  logRequest('POST', '/api/kafka/publish', { topic, message });

  try {
    await producer.send({
      topic,
      messages: [
        { 
          value: JSON.stringify(message) 
        },
      ],
    });

    logResponse('POST', '/api/kafka/publish', 200, { topic, message });
    
    res.status(200).json({
      message: 'Message published successfully',
      data: { topic, message },
      status: 200,
      success: true,
    });
    
  } catch (error) {
    logError('POST', '/api/kafka/publish', error, 'Failed to publish message', { topic, message });
    
    res.status(500).json({
      data: null,
      message: 'Failed to publish message',
      status: 500,
      success: false,
    });
  }
});

// Kafka 연결 상태 확인 API
router.get('/kafka/status', async (req: Request, res: Response) => {
  logRequest('GET', '/api/kafka/status', {});

  try {
    // Kafka 연결 테스트
    await connectKafka();
    
    logResponse('GET', '/api/kafka/status', 200, {});
    
    res.status(200).json({
      message: 'Kafka connection successful',
      data: { 
        connected: true,
        brokers: ['localhost:9092'],
        clientId: 'spm-consumer'
      },
      status: 200,
      success: true,
    });
    
  } catch (error) {
    logError('GET', '/api/kafka/status', error, 'Kafka connection failed', {});
    
    res.status(500).json({
      data: null,
      message: 'Kafka connection failed',
      status: 500,
      success: false,
    });
  }
});

export default router;
