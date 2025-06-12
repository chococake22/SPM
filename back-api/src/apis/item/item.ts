import express, { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import upload from '../../utils/upload';

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
  try {
    // 4개만 가져오도록
    const response = await api.get(`${dbUrl}/items?_start=${offset}&_limit=${limit}`); // /items로 요청 (baseURL 자동 적용)
    const data = response.data;
    res.status(200).json({ message:'데이터를 가져왔습니다.', data: data, status: 200, success: true});
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.get('/user-list', async (req: Request, res: Response) => {
  const { username, offset, limit } = req.query as {
    username: string;
    offset: string;
    limit: string;
  };
  try {
    // 4개만 가져오도록
    const response = await api.get(
      `${dbUrl}/items?_start=${offset}&_limit=${limit}`, { params: { username }}
    ); // /items로 요청 (baseURL 자동 적용)

    const data = response.data;
    res
      .status(200)
      .json({
        message: '데이터를 가져왔습니다.',
        data: data,
        status: 200,
        success: true,
      });

  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

router.post(
  '/upload',
  upload.single('itemImg'),
  async (req: Request, res: Response): Promise<void> => {
    const { userId, username, itemName, description } = req.body;
    const file = (req as MulterRequest).file;

    console.log('userId:', userId);
    console.log('username:', username);
    console.log('itemName:', itemName);
    console.log('description:', description);
    console.log('file:', file?.originalname, file?.mimetype);

    if (!file) {
      res.status(400).json({ message: '파일이 없습니다.', success: false });
      return;
    }

    try {
      // 데이터를 가져옴

      // 해당 ID가 있는지 먼저 확인.

      

        const imagePath = file.filename;
        console.log(imagePath);
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

        res.status(200).json({
          message: '게시글이 등록되었습니다.',
          data: data,
          status: 200,
          success: true,
        });
        return;
      
      
    } catch (error) {
      console.error('Error fetching items:', error);
      res
        .status(500)
        .json({ message: 'Error fetching items', status: 500, success: false });
      return;
    }
  }
);

export default router;
