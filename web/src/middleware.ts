import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 로그 확인용
  console.log('pathname: ' + request.nextUrl.pathname);

  // accessToken이 쿠키에 있는지 확인
  const accessToken = request.cookies.get('accessToken');

  if (!accessToken) {
    // 로그인 페이지가 아닌 다른 페이지에서 인증이 안되었을 경우 리다이렉트
    if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

// 미들웨어가 적용되는 기준
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|testImage|icons).*)',
  ],
};
