import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import jwt from 'jsonwebtoken';
import { logRequest, logResponse, logError } from '../../utils/logger';
import prisma from '../../lib/prisma';
import { producer } from '../../lib/kafka';

const dbUrl = process.env.DB_URL || 'http://localhost:3002';
// const JWT_SECRET = process.env.JWT_SECRET || 'No key';
const router = Router();

router.get('/list', async (req: Request, res: Response) => {
  const { offset, limit } = req.query as {
    offset: string;
    limit: string;
  };

  logRequest('GET', '/api/board/list', { offset, limit });

  try {
    const message = {
      offset: offset,
      limit: limit,
      api: '/api/board/list',
      date: new Date(),
    };

    await producer.send({
      topic: 'board-topic',
      messages: [
        {
          key: '/api/board/list',
          value: JSON.stringify(message),
        },
      ],
    });

    // 정해진 개수만 가져오도록
    const totalCount = await prisma.board.count();
    const boards = await prisma.board.findMany({
      skip: offset ? parseInt(offset) : 0,
      take: limit ? parseInt(limit) : 10,
      orderBy: {
        regiDttm: 'desc',
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profileImg: true,
          },
        },
      },
    });

    const data = {
      list: boards,
      totalCount: totalCount,
    };

    logResponse('GET', '/api/board/list', 200, { offset, limit });
    res.status(200).json({ message:'데이터를 가져왔습니다.', data: data, status: 200, success: true});
  } catch (error) {
    logError('GET', '/api/board/list', error, '서버 오류가 발생했습니다.', { offset, limit });
    
    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

// router.get('/list', async (req: Request, res: Response) => {
//   const { offset, limit } = req.query as {
//     offset: string;
//     limit: string;
//   };

//   logRequest('GET', '/api/board/list', { offset, limit });

//   try {
//     const totalCount = await prisma.board.count();
//     const boards = await prisma.board.findMany({
//       skip: offset ? parseInt(offset) : 0,
//       take: limit ? parseInt(limit) : 10,
//       orderBy: {
//         regiDttm: 'desc'
//       },
//       include: {  // board 테이블의 userId와 user 테이블의 userId를 조인함
//         user: {
//           select: {
//             userId: true,
//             username: true
//           }
//         }
//       }
//     });

//     const data = {
//       list: boards,
//       totalCount: totalCount,
//     };

//     logResponse('GET', '/api/board/list', 200, { offset, limit });
//     res.status(200).json({
//       message: '데이터를 가져왔습니다.',
//       data: data,
//       status: 200,
//       success: true,
//     });
//   } catch (error) {
//     logError('GET', '/api/board/list', error, '서버 오류가 발생했습니다.', {
//       offset,
//       limit,
//     });

//     res.status(500).json({
//       data: null,
//       message: '서버 오류가 발생했습니다.',
//       status: 500,
//       success: false,
//     });
//   }
// });

router.get('/detail', async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };

  logRequest('GET', '/api/board/detail', { id });

  try {
    const message = {
      id: id,
      api: '/api/board/detail',
      date: new Date(),
    };

    await producer.send({     
      topic: 'board-topic',
      messages: [
        {
          key: '/api/board/detail',
          value: JSON.stringify(message),
        },
      ],
    });

    // 4개만 가져오도록
    const board = await prisma.board.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profileImg: true,
          },
        },
      },
    });

    if (!board) {
      logResponse('GET', `/api/board/detail/${id}`, 404, { id });
      res.status(404).json({
        data: null,
        message: '게시글을 찾을 수 없습니다.',
        status: 404,
        success: false,
      });
      return;
    }

    logResponse('GET', `/api/board/detail/${id}`, 200, { id });

    res.status(200).json({
      message: '데이터를 가져왔습니다.',
      data: board,
      status: 200,
      success: true,
    });
  } catch (error) {
    logError('GET', '/api/board/detail', error, '서버 오류가 발생했습니다.', {
      id,
    });
    
    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

router.post('/upload', async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;

  logRequest('POST', '/api/board/upload', { title, content });

  // JWT_SECRET 환경변수 확인
  // 전역에서 불러오면 안되는데 함수 안에서 불러오면 됨.
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    res.status(500).json({ message: 'JWT_SECRET is not set' });
    return;
  }

  try {
    const message = {
      title: title,
      content: content,
      api: '/api/board/upload',
      date: new Date(),
    };

    await producer.send({
      topic: 'board-topic',
      messages: [
        {
          key: '/api/board/upload',
          value: JSON.stringify(message),
        },
      ],
    });

    // 액세스 토큰 확인
    const token = req.cookies.accessToken;

    if (!token) {
      logResponse('POST', '/api/board/upload', 401, { title, content });
      res.status(401).json({ message: '액세스 토큰이 없습니다.' });
    }

    let decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const newBoard = await prisma.board.create({
      data: {
        title: title,
        content: content,
        userId: decoded.userId,
        regiId: decoded.userId,
        regiDttm: new Date(),
        finalModId: decoded.userId,
        finalModDttm: new Date(),
      },
    });

    const data = {
      id: newBoard.id,
      userId: decoded.userId,
    };

    logResponse('POST', '/api/board/upload', 200, { title, content });

    res.status(200).json({
      data: data,
      message: '등록이 완료되었습니다.',
      status: 200,
      success: true,
    });
  } catch (error) {
    logError('POST', '/api/board/upload', error, '서버 오류가 발생했습니다.', {
      title,
      content,
    });

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

function formatDateToYMDHMS(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export default router;
