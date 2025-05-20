"use client"

import "./global.css";
import BottomNav from "../components/BottomNav"
import TopNav from '../components/TopNav';
import { usePathname } from 'next/navigation';
import { UserProvider } from "@/lib/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup') {
    return (
      <html lang="en">
        <body className="w-full h-screen flex justify-center items-center">
          <UserProvider>
            <div className="w-full h-full">{children}</div>
          </UserProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <UserProvider>
          <header>
            <TopNav />
          </header>

          <main>
            {/* 메인 콘텐츠는 가능한 공간을 채웁니다. */}
            {children}
          </main>
          <footer>
            <BottomNav />
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
