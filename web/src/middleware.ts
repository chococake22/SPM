import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  // console.log('pathname: ' + request.nextUrl.pathname);
  // 인증이 되지 않은 경우에 로그인 페이지로 이동
  // 인증 기준은 토큰

  // 임시로 지정.
  if (request.nextUrl.pathname === '/profile') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}


// 미들웨어가 적용되는 기준
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
