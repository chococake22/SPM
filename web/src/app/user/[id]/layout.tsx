import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '사용자 프로필',
  description: '사용자의 프로필과 게시물을 확인하세요',
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 