"use client"

import { usePathname } from 'next/navigation';
import BottomNav from "./BottomNav";
import TopNav from './TopNav';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const pathname = usePathname();
  
  // 네비게이션이 필요없는 페이지들
  const noNavigationPaths = ['/login', '/signup', '/expired'];
  const shouldShowNavigation = !noNavigationPaths.includes(pathname);

  if (!shouldShowNavigation) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        {children}
      </div>
    );
  }

  return (
    <>
      <header className="fixed h-9 w-full flex-shrink-0 z-50">
        <TopNav />
      </header>
      <main className="flex-1 flex justify-center pt-12 pb-12">
        {children}
      </main>
      <footer className="fixed h-14 w-full bottom-0 bg-white z-50">
        <BottomNav />
      </footer>
    </>
  );
} 