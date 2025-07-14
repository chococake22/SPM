import express, { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import upload from '../../utils/upload';
import { logRequest, logResponse, logError } from '../../utils/logger';
import prisma from '../../lib/prisma';
import { producer } from '../../lib/kafka';

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const dbUrl = process.env.DB_URL || 'http://localhost:3002';
const router = Router();

router.get('/list', async (req: Request, res: Response) => {
  const { offset, limit } = req.query as {
    offset: string;
    limit: string;
  };

  logRequest('GET', '/api/item/list', { offset, limit });

  try {

    const message = {
      offset: offset,
      limit: limit,
      api: '/api/item/list',
      date: new Date(),
    };

    await producer.send({
      topic: 'item-topic',
      messages: [
        {
          key: '/api/item/list',
          value: JSON.stringify(message),
        },
      ],
    });

    const totalCount = await prisma.item.count();
    const items = await prisma.item.findMany({
      skip: offset ? parseInt(offset) : 0,
      take: limit ? parseInt(limit) : 10,
      orderBy: {
        id: 'asc',
      },
      include: {
        // board 테이블의 userId와 user 테이블의 userId를 조인함
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
      list: items,
      totalCount: totalCount,
    };

    logResponse('GET', '/api/item/list', 200, { offset, limit });

    res.status(200).json({
      message: '데이터를 가져왔습니다.',
      data: data,
      status: 200,
      success: true,
    });
  } catch (error) {
    logError('GET', '/api/item/list', error, '서버 에러가 발생했습니다.', { offset, limit });

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

// router.get('/user-list', async (req: Request, res: Response) => {
//   const { id, offset, limit } = req.query as {
//     id: string;
//     offset: string;
//     limit: string;
//   };

//   logRequest('GET', '/api/item/user-list', { id, offset, limit });

//   try {
//     if (!id) {
//       res.status(400).json({ message: 'id is required' });
//       return;
//     }

//     // 먼저 users 테이블에서 해당 id의 사용자 정보를 가져옴
//     const userResponse = await api.get(`${dbUrl}/users/${id}`);
//     const user = userResponse.data;

//     if (!user) {
//       logResponse('GET', '/api/item/user-list', 404, { id, offset, limit });
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     // 해당 사용자의 username으로 items를 필터링
//     const response = await api.get(
//       `${dbUrl}/items?username=${user.username}&_start=${offset}&_limit=${limit}`
//     );

//     const data = response.data;
    
//     logResponse('GET', '/api/item/user-list', 200, { id, offset, limit });
    
//     res
//       .status(200)
//       .json({
//         message: '데이터를 가져왔습니다.',
//         data: data,
//         status: 200,
//         success: true,
//       });
//   } catch (error) {
//     logError('GET', '/api/item/user-list', error, '서버 에러가 발생했습니다.', { id, offset, limit });

//     res.status(500).json({
//       data: null,
//       message: '서버 오류가 발생했습니다.',
//       status: 500,
//       success: false,
//     });
//   }
// });


router.get('/user-list', async (req: Request, res: Response) => {
  const { userId, offset, limit } = req.query as {
    userId: string;
    offset: string;
    limit: string;
  };

  logRequest('GET', '/api/item/user-list', { userId, offset, limit });

  try {

    const message = {
      userId: userId,
      offset: offset,
      limit: limit,
      api: '/api/item/user-list',
      date: new Date(),
    };

    await producer.send({

      topic: 'item-topic',
      messages: [
        {
          key: '/api/item/user-list',
          value: JSON.stringify(message),
        },
      ],
    });

    const decodedId = userId ? decodeURIComponent(userId) : '';
    const totalCount = await prisma.item.count({
      where: {
        userId: decodedId,
      },
    });
    const items = await prisma.item.findMany({
      skip: offset ? parseInt(offset) : 0,
      take: limit ? parseInt(limit) : 10,
      where: {
        userId: decodedId,
      },
      include: {
        user: {
          select: {
            userId: true,
            username: true, // userImg도 함께 조인
          },
        },
      },
    });

    const data = {
      list: items,
      totalCount: totalCount,
    };

    logResponse('GET', '/api/item/user-list', 200, {
      decodedId,
      offset,
      limit,
    });

    res.status(200).json({
      message: '데이터를 가져왔습니다.',
      data: data,
      status: 200,
      success: true,
    });
  } catch (error) {
    logError('GET', '/api/item/user-list', error, '서버 에러가 발생했습니다.', {
      userId,
      offset,
      limit,
    });

    res.status(500).json({
      data: null,
      message: '서버 오류가 발생했습니다.',
      status: 500,
      success: false,
    });
  }
});

router.post(
  '/upload',
  upload.single('itemImg'),
  async (req: Request, res: Response): Promise<void> => {
    const { userId, username, itemName, description } = req.body;
    const file = (req as MulterRequest).file;

    logRequest('POST', '/api/item/upload', { userId, username, itemName, description, file });

    if (!file) {
      res.status(400).json({ message: '파일이 없습니다.', success: false });
      return;
    }

    const imagePath = file.filename;

    try {
      const message = {
        userId: userId,
        username: username,
        itemName: itemName,
        description: description,
        api: '/api/item/upload',
        date: new Date(),
      };

      await producer.send({
        topic: 'item-topic',
        messages: [
          {
            key: '/api/item/upload',
            value: JSON.stringify(message),
          },
        ],
      });

      const newItem = await prisma.item.create({
        data: {
          itemImg: '/' + imagePath,
          title: itemName, // itemName을 title로 매핑
          description: description,
          userId: userId,
          regiId: userId,
          regiDttm: new Date(),
          finalModId: userId,
          finalModDttm: new Date(),
        },
      });

      const data = {
        id: newItem.id,
        userId: userId,
      };

      logResponse('POST', '/api/item/upload', 200, { userId, username, itemName, description, file });

      res.status(200).json({
        message: '아이템이 등록되었습니다.',
        data: data,
        status: 200,
        success: true,
      });
      return;
    } catch (error) {
      logError('POST', '/api/item/upload', error, '서버 에러가 발생했습니다.', { userId, username, itemName, description, file });

      res.status(500).json({
        data: null,
        message: '서버 오류가 발생했습니다.',
        status: 500,
        success: false,
      });
    }
  }
);

export default router;
