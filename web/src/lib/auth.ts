import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
    userId: string;
    username: string;
    exp: number;
    iat: number;
}

export const jwtUtils = {

    getUserFromToken: (token: string) => {
        try {
            const decoded = jwtDecode<JWTPayload>(token);
            return {
                userId: decoded.userId,
                username: decoded.username,
            }
        } catch (error) {
            console.error("JWT 토큰 디코딩 오류:", error);
            return null;
        }
    },
    isTokenValid: (token: string) => {
        try {
            const decoded = jwtDecode<JWTPayload>(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp && decoded.exp > currentTime;
        } catch (error) {
            console.error("JWT 토큰 유효성 검사 오류:", error);
            return false;
        }
    }
};