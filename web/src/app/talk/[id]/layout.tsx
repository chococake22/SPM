import { ReactNode } from 'react';

interface TalkIdLayoutProps {
  children: ReactNode; // children의 타입을 ReactNode로 설정
}

export default function TalkIdLayout({ children }: TalkIdLayoutProps) {
  return <>{children}</>;
}
