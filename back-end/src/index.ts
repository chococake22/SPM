import express, { Request, Response } from 'express';

const app = express();

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello Typescript123');
});

// port 번호
const port: number = 3000;

app.listen(port, () => console.log(`Server On!!! Port: ${port}`));
