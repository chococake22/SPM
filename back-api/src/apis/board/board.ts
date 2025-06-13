import { Router, Request, Response } from 'express';
import api from '../../lib/axios'; 
import jwt from 'jsonwebtoken';

const dbUrl = process.env.DB_URL || 'http://localhost:3002';
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';;

const router = Router();

router.get('/list', async (req: Request, res: Response) => {
  const { offset, limit } = req.query as {
    offset: string;
    limit: string;
  };
  try {

    // 4개만 가져오도록
    const response = await api.get(`${dbUrl}/boards?_start=${offset}&_limit=${limit}`); // /items로 요청 (baseURL 자동 적용)
    const total = await api.get(`${dbUrl}/boards`);
    const data = {
      list: response.data,
      totalCount: total.data.length,
    };
    res.status(200).json({ message:'데이터를 가져왔습니다.', data: data, status: 200, success: true});
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// router.get('/user-list', async (req: Request, res: Response) => {
//   const { username, offset, limit } = req.query as {
//     username: string;
//     offset: string;
//     limit: string;
//   };
//   try {
//     // 4개만 가져오도록
//     const response = await api.get(
//       `${dbUrl}/items?_start=${offset}&_limit=${limit}`, { params: { username }}
//     ); // /items로 요청 (baseURL 자동 적용)

//     const data = response.data;
//     res
//       .status(200)
//       .json({
//         message: '데이터를 가져왔습니다.',
//         data: data,
//         status: 200,
//         success: true,
//       });

//   } catch (error) {
//     console.error('Error fetching items:', error);
//     res.status(500).json({ message: 'Error fetching items' });
//   }
// });

router.post('/upload', async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;

  const token = req.cookies.accessToken;
  const decoded = jwt.verify(token, JWT_SECRET) as {
    userId: string;
    [key: string]: any;
  };

  const now = new Date();
  const formattedNow = formatDateToYMDHMS(now);

  console.log(
    "post, '/upload': " + decoded.username + ', ' + title + ', ' + content
  );

  try {
    const response = await api.post(`${dbUrl}/boards`, {
      username: decoded.username,
      title: title,
      content: content,
      regiDttm: formattedNow,
      finalModDttm: formattedNow,
    });

    const data = response.data;
    const status = response.status;

    res.status(200).json({
      data: data,
      message: '등록이 완료되었습니다.',
      status: status,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
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
