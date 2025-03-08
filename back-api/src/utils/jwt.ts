import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


// 액세스 토큰 발급
export const getTokenSet = (userId: string, userPw: string) => {

  // 액세스 토큰: 1시간
    const accessToken = jwt.sign(
      { userId: userId, userPw: userPw }, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
      }
    );

    // 리프레시 토큰: 1주일
    const refreshToken = jwt.sign(
      { userId: userId, userPw: userPw },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );


    return [accessToken, refreshToken];
}

export default getTokenSet;