"use client"

import "./global.css";
import BottomNav from "@/components/BottomNav"
import TopNav from '@/components/TopNav';
import { usePathname } from 'next/navigation';
import { UserProvider } from "@/hook/UserContext";
import path from "path";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup' || pathname === '/expired') {
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
      <body className="flex flex-col">
        <UserProvider>
          <header className="fixed h-9 w-full flex-shrink-0 z-50">
            <TopNav />
          </header>
          <main className="flex-1 flex items-center justify-center">
            {children}
          </main>

          <footer className="fixed h-12 w-full bottom-0 bg-white z-50">
            <BottomNav />
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
