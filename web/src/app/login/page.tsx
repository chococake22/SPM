"use client"

import { useEffect, useState } from 'react';
import InputText from "../../components/InputText";
import axios from 'axios';

const LoginPage = () => {
    const [list, setList] = useState([]);

  // 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3010/test'); // 데이터를 요청하는 엔드포인트
        console.log(response.data)
        setList(response.data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // 컴포넌트가 마운트되면 데이터 요청 실행
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
      </div>
    </div>
  );
};

export default LoginPage;
