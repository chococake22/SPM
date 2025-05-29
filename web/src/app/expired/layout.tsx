"use client"

import { ReactNode } from 'react';

export default function ExpiredLayout({ children }: { children: ReactNode }) {
  return (
    <div className='w-full h-full flex justify-center itmes-center'>
      {children}
    </div>
  );
}
