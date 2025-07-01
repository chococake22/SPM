import express, { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import upload from '../../utils/upload';
import { logRequest, logResponse, logError } from '../../utils/logger';

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
    const itemsRes = await api.get(
      `${dbUrl}/items?_start=${offset}&_limit=${limit}`
    );
    const items = itemsRes.data;

    // 중복 제거된 username 리스트
    const usernames = [...new Set(items.map((item: any) => item.username))];

    // 각 사용자 정보 가져오기
    const userResponses = await Promise.all(
      usernames.map((username) =>
        api.get(`${dbUrl}/users?username=${username}`)
      )
    );

    const userMap = new Map();
    userResponses.forEach((res) => {
      const user = res.data[0]; // ?username=xxx 는 배열로 응답
      if (user) {
        userMap.set(user.username, user);
      }
    });

    // item에 user 정보 병합
    const combined = items.map((item: any) => ({
      ...item,
      profileImg: userMap.get(item.username)?.profileImg || null,
    }));
    
    logResponse('GET', '/api/item/list', 200, { offset, limit });

    res.status(200).json({
      message: '데이터를 가져왔습니다.',
      data: combined,
      status: 200,
      success: true,
    });
  } catch (error) {
    logError('GET', '/api/item/list', error, { offset, limit });
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

router.get('/user-list', async (req: Request, res: Response) => {
  const { id, offset, limit } = req.query as {
    id: string;
    offset: string;
    limit: string;
  };

  logRequest('GET', '/api/item/user-list', { id, offset, limit });

  try {
    if (!id) {
      res.status(400).json({ message: 'id is required' });
      return;
    }

    // 먼저 users 테이블에서 해당 id의 사용자 정보를 가져옴
    const userResponse = await api.get(`${dbUrl}/users/${id}`);
    const user = userResponse.data;

    if (!user) {
      logResponse('GET', '/api/item/user-list', 404, { id, offset, limit });
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // 해당 사용자의 username으로 items를 필터링
    const response = await api.get(
      `${dbUrl}/items?username=${user.username}&_start=${offset}&_limit=${limit}`
    );

    const data = response.data;
    
    logResponse('GET', '/api/item/user-list', 200, { id, offset, limit });
    
    res
      .status(200)
      .json({
        message: '데이터를 가져왔습니다.',
        data: data,
        status: 200,
        success: true,
      });
  } catch (error) {
    logError('GET', '/api/item/user-list', error, { id, offset, limit });
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
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
      // 이미지 등록
      await api.post(`${dbUrl}/items`, {
        itemImg: '/' + imagePath,
        username: username,
        itemName: itemName,
        description: description
      });

      const data = {
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
      logError('POST', '/api/item/upload', error, { userId, username, itemName, description, file });
      res
        .status(500)
        .json({ message: 'Error fetching items', status: 500, success: false });
      return;
    }
  }
);

export default router;
