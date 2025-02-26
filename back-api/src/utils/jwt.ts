import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


// 액세스 토큰 발급
export const getTokenSet = (userId: string, userPw: string) => {

    const accessToken = jwt.sign(
      { userId: userId, userPw: userPw }, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
      }
    );

    const refreshToken = jwt.sign(
      { userId: userId, userPw: userPw },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );

    let tokenSet = {
        accessToken: accessToken,
        refreshToken: refreshToken
    }

    return [accessToken, refreshToken];
}

export default getTokenSet;