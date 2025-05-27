import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const openPaths = ['/api/login', '/api/signup'];

  if (openPaths.includes(req.path)) {
    return next(); // 인증이 필요 없는 경로는 통과
  }

  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET or REFRESH_SECRET is not defined in .env');
  }

  if (!accessToken) {
    res.status(401).json({ message: 'Access Token is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    (req as any).user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      if (!refreshToken) {
        res.status(401).json({ message: 'Refresh Token is missing' });
        return;
      }

      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          JWT_SECRET
        ) as jwt.JwtPayload;

        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId },
          JWT_SECRET,
          { expiresIn: '10s' }
        );

        console.log("New Access Token is created!!")

        // 새 토큰을 쿠키에 설정
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });

        (req as any).user = decodedRefresh;
        return next();
      } catch (refreshErr) {
        res
          .status(401)
          .json({ message: 'Invalid or expired Refresh Token' });
          return;
      }
    }

    res.status(401).json({ message: 'Invalid Access Token' });
    return;
  }
}
