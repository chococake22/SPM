"use client"

import { FormEvent, useEffect, useState } from 'react';
import InputText from "@/components/InputText";
import api from '@/lib/axios';
import { userService } from '@/services/user.service';
import { LoginForm, LoginResponse } from '@/types/user/type';
import { useRouter } from 'next/navigation';
import {useUser} from '@/lib/UserContext';


const LoginPage = () => {
  // const [userInfo, setUserInfo] = useState<LoginResponse | null>();
  const {setUser} = useUser();
  const router = useRouter();

  const handleSignup = () => {
    router.push('/signup');
  };

  // 로그인 제출
  const handleLogin = async (e: FormEvent) => {
    // 자동으로 새로고침되어서 한번 더 요청이 나가는 것을 방지한다.
    e.preventDefault();

    // FormData를 이용해서 name에 정의된 값을 가져온다.
    const formData = new FormData(e.target);
    const userId = formData.get('userId');
    const userPw = formData.get('userPw');

    if(userId === '' && userPw === '') {
      alert("로그인 정보를 입력하세요.")
      return;
    }

    const params = {
      userId: userId,
      userPw: userPw
    }

    try {
      const response = await userService.login(params);
      console.log(response)
      if(response.data) {
        setUser(response)
        router.push("/");
      }
      // setUserInfo(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div>
        <div className="flex justify-center mb-4">
          <span className="text-xl">Login</span>
        </div>
        <form id='loginForm' onSubmit={handleLogin} method="POST">
          <div>
            <InputText placeholder="User ID(Email)" name="userId" type="text" />
          </div>
          <div className="mt-3">
            <InputText placeholder="Password" name="userPw" type="password" />
          </div>
          <div className="flex justify-evenly mt-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
            <button
              type="button"
              className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
