import express, { Request, Response } from 'express';
import cors from 'cors';  // CORS 미들웨어 임포트
import axios from "../../../../web/src/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const app = express();

app.post('/getItemList', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('/items');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// port 번호
const port: number = 3001;

app.listen(port, () => console.log(`Server On!!! Port: ${port}`));
