import { ReactNode } from 'react';

interface BoardProps {
  children: ReactNode; // children의 타입을 ReactNode로 설정
}

export default function BoardLayout({ children }: BoardProps) {
  return <>{children}</>;
}
