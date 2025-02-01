"use client"

import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="login-container">
      {/* 로그인 페이지의 레이아웃 */}
      {children}
    </div>
  );
}
