'use client';

import { useUser } from '@/lib/UserContext';
import { userService } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import InputText from '@/components/InputText';

export default function Mypage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        const response = await userService.logout();
        alert(response.message);
        // 로그아웃을 하고 나면 뒤로 갈 수 없어야 해서 replace 사용
        router.replace('/login');
      } catch (error) {
        console.error(error);
      }
    }
  };

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
      <div className="flex flex-col w-[40%] h-[30%] justify-around">
        <div>
          <InputText
            placeholder="User ID(Email)"
            name="userId"
            type="text"
            defaultValue={user?.userId}
          />
        </div>
        <div>
          <InputText
            placeholder="User Name"
            name="username"
            type="text"
            defaultValue={user?.username}
          />
        </div>
        <div>
          <InputText
            placeholder="Phone"
            name="phone"
            type="text"
            defaultValue={user?.phone}
          />
        </div>
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
