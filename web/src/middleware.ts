import { NextResponse, type NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

export async function middleware(request: NextRequest) {

  // 요청할 url
  const pathname = request.nextUrl.pathname;

  try {
    // accessToken이 쿠키에 있는지 확인
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // 액세스 토큰이 없는 경우
    if (!accessToken) {
      // 로그인 페이지가 아닌 다른 페이지에서 인증이 안되었을 경우 리다이렉트
      if (pathname !== '/login' && pathname !== '/signup') {
        const response = NextResponse.redirect(new URL('/login', request.url));

        // 토큰 초기화
        response.cookies.set('accessToken', '', {
          maxAge: 0,
          path: '/',
        });
        response.cookies.set('refreshToken', '', {
          maxAge: 0,
          path: '/',
        });

        console.log('No Access Token!! 쿠키 삭제 후 로그인 페이지로 리다이렉트');
        return response;
      }
    } else {

      // 리프레시 토큰 만료시 -> 로그아웃 후 로그인 페이지로 이동.
      if (expiredToken(refreshToken as string)) {
        if (!request.url.includes('/login')) {

          const response = NextResponse.redirect(
            new URL('/login', request.url)
          );

          // 토큰 초기화
          response.cookies.set('accessToken', '', {
            maxAge: 0,
            path: '/',
          });

          response.cookies.set('refreshToken', '', {
            maxAge: 0,
            path: '/',
          });

          console.log(
            'No Access Token!! 쿠키 삭제 후 로그인 페이지로 리다이렉트'
          );
          return response;
        }
      }

      // 액세스 토큰은 만료되었는데 리프레시 토큰은 만료되지 않은 경우
      // 액세스 토큰 재발급(api 요청 후 토큰 재발급)
      if (expiredToken(accessToken as string)) {
        if (pathname !== '/signup' && pathname !== '/login') {
          console.log("Access Token is expired!!");
        } 
      } 
    }
  } catch(error) {
    console.log(error)
  }
}

// 토큰 만료 검증
function expiredToken(token: string): boolean {
  try {
    const payload = decodeJwt(token); // jose가 토큰 payload를 파싱
    const now = Math.floor(Date.now() / 1000);
    const isExpired = (payload.exp ?? 0) < now;
    return isExpired;
  } catch (error) {
    console.error('Token Decoding failed:', error);
    return true; // 디코딩 실패 시 만료된 것으로 처리
  }
}



// 미들웨어가 적용되는 기준
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|testImage|icons|.*\\.(?:png|jpg|jpeg|svg|webp|ico)).*)',
  ],
};
