import { ReactNode } from 'react';

interface AddItemLayoutProps {
  children: ReactNode; // children의 타입을 ReactNode로 설정
}

export default function AddItemLayout({ children }: AddItemLayoutProps) {
  return <>{children}</>;
}
