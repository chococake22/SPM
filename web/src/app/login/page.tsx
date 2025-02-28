"use client"

import { FormEvent, useEffect, useState } from 'react';
import InputText from "@/components/InputText";
import api from '@/lib/axios';
import { userService } from '@/services/user.service';
import { LoginForm, LoginResponse } from '@/types/user/type';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
  const [list, setList] = useState([]);
  const [userInfo, setUserInfo] = useState<LoginResponse | null>();
  const [data, setData] = useState<LoginForm>({userId: '', userPw: ''});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value, // name 속성을 키로 사용하여 값 업데이트
    }));
  };


  const handleSignup = () => {
    router.push('/signup')
  };

  const handleSubmit = async (event: FormEvent) => {
    try {
      const response = await userService.login(data);
      setUserInfo(response);
      console.log(response);
      alert(response.userId);
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
        <form onSubmit={handleSubmit} method="POST">
          <div>
            <InputText
              placeholder="User ID"
              name="userId"
              type="text"
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-3">
            <InputText
              placeholder="Password"
              name="userPw"
              type="password"
              onChange={handleInputChange}
            />
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
