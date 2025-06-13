import { ReactNode } from 'react';

interface BoardIdLayoutProps {
  children: ReactNode; // children의 타입을 ReactNode로 설정
}

export default function BoardIdLayout({ children }: BoardIdLayoutProps) {
  return <>{children}</>;
}
