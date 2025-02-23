"use client"

import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className='w-full h-full flex justify-center itmes-center'>
      <div className="login-container">
        {children}
      </div>
    </div>
  );
}
