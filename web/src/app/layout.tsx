"use client"

import "./global.css";
import BottomNav from "../components/bottomNav"
import TopNav from '../components/topNav';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  if(pathname === '/login') {
    return (
      <html lang="en">
        <body className="flex flex-col min-h-screen">{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-grow">
          {' '}
          {/* 메인 콘텐츠는 가능한 공간을 채웁니다. */}
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
