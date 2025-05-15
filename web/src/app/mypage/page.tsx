"use client"

import { useUser } from '@/lib/UserContext';
import { userService } from '@/services/user.service';
import { useEffect } from 'react';

export default function Mypage() {
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
        <div className="flex w-full h-[20%] border-b-2 mt-10">
          <div className="flex border-2 w-[32%] justify-center items-center">
            <div className="w-[80%] h-[80%] rounded-full border-2"></div>
          </div>
          <div className="flex border-2 w-[70%] justify-around items-center">
            <div className="border-2">
              <div>게시물</div>
              <div className="flex items-center justify-center">
                <span>89</span>
              </div>
            </div>
            <div className="border-2">
              <div>팔로잉</div>
              <div className="flex items-center justify-center">
                <span>89</span>
              </div>
            </div>
            <div className="border-2">
              <div>팔로워</div>
              <div className="flex items-center justify-center">
                <span>89</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[85%] mb-10">사진 영역</div>
      </div>
    </div>
  );
}
