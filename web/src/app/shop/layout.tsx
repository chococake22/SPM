import { ReactNode } from 'react';

interface ShopLayoutProps {
  children: ReactNode; // children의 타입을 ReactNode로 설정
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return <>{children}</>;
}
