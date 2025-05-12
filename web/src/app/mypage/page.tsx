"use client"

import { useUser } from '@/lib/UserContext';
import { userService } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import InputText from '@/components/InputText';

export default function Mypage() {
  const router = useRouter();
  const { user, setUser } = useUser();



  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await userService.user();
        setUser(response.userDb);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [setUser]);



  if (!user) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div>Loading...</div> {/* 로딩 상태 표시 */}
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-[15%] border-b-2 mt-10">프로필 영역</div>
        <div className="w-full h-[85%] mb-10">사진 영역</div>
      </div>
    </div>
  );
}
