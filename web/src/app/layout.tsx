"use client"

import "./global.css";
import BottomNav from "../components/BottomNav"
import TopNav from '../components/TopNav';
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
        <div>

            {/* 메인 콘텐츠는 가능한 공간을 채웁니다. */}
            {children}

        </div>
        <BottomNav />
      </body>
    </html>
  );
}
