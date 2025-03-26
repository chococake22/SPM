"use client"

import { userService } from '@/services/user.service';

export default function Mypage() {

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        const response = await userService.logout();
        alert(response.userId);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div>
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
