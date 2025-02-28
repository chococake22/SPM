"use client"

import { FormEvent, useEffect, useState } from 'react';
import InputText from "@/components/InputText";
import api from '@/lib/axios';
import { userService } from '@/services/user.service';
import { LoginForm, LoginResponse } from '@/types/user/type';
import { useRouter } from 'next/navigation';


const SignUpPage = () => {
  const [list, setList] = useState([]);
  const [userInfo, setUserInfo] = useState<LoginResponse | null>();
  const router = useRouter();
  const [data, setData] = useState<SignupForm>({
    userId: '',
    userPw: '',
    userPwChk: '',
    username: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value, // name 속성을 키로 사용하여 값 업데이트
    }));
  };


  const handleSubmit = async (event: FormEvent) => {
    if(confirm("제출하시겠습니까?")) {
      try {
        const response = await userService.signup(data);
        setUserInfo(response);
        alert(response.userId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleReset = () => {
    if (confirm('입력한 데이터를 삭제하시겠습니까?')) {
      setData({
        userId: '',
        userPw: '',
        userPwChk: '',
        username: '',
        phone: '',
      });
    }
  };

  const handleLoginPage = () => {
    router.push('/login');
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div>
        <div className="flex justify-center mb-4">
          <span className="text-xl">Sign Up</span>
        </div>
        <form onSubmit={handleSubmit} method="POST">
          <div>
            <InputText
              placeholder="User ID(Email)"
              name="userId"
              type="email"
              value={data.userId}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-3">
            <InputText
              placeholder="Password"
              name="userPw"
              type="password"
              value={data.userPw}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-3">
            <InputText
              placeholder="Password Check"
              name="userPwChk"
              type="password"
              value={data.userPwChk || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-3">
            <InputText
              placeholder="User Name"
              name="username"
              type="text"
              value={data.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-3">
            <InputText
              placeholder="Phone Number"
              name="phone"
              type="phone"
              value={data.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-evenly mt-5">
            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
              onClick={handleLoginPage}
            >
              Back
            </button>
          </div>
          <div className="flex justify-evenly mt-5">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
