"use client"

import { useEffect, useState } from 'react';
import InputText from "@/components/InputText";
import api from '@/lib/axios';

const LoginPage = () => {
    const [list, setList] = useState([]);

  const test = async () => {
    try {
      const response = await api.get('/test'); // 데이터를 요청하는 엔드포인트
      console.log(response.data);
      setList(response.data); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // 데이터 요청
  useEffect(() => {
    test(); // 컴포넌트가 마운트되면 데이터 요청 실행
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div>
        <div className="flex justify-center mb-4">
          <span className="text-xl">Login</span>
        </div>
        <div>
          <InputText placeholder="User ID" />
        </div>
        <div className="mt-3">
          <InputText placeholder="Password" />
        </div>
        <div className="flex justify-evenly mt-5">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
          <button
            type="button"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
