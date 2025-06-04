import { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode; // children의 타입을 ReactNode로 설정
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
