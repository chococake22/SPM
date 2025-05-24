"use client"

import { FormEvent, useEffect, useState } from 'react';
import InputText from "@/components/InputText";
import api from '@/lib/axios';
import { userService } from '@/services/user.service';
import { LoginForm, LoginResponse, SignupRequest } from '@/types/user/type';
import { useRouter } from 'next/navigation';
import Button from '../../components/common/Button';


const SignUpPage = () => {
  const [list, setList] = useState([]);
  const [userInfo, setUserInfo] = useState<LoginResponse | null>();
  const router = useRouter();
  const [data, setData] = useState<SignupRequest>({
    userId: '',
    userPw: '',
    userPwChk: '',
    username: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value, // name 속성을 키로 사용하여 값 업데이트
    }));
  };


  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault(); // 폼 제출시 페이지가 새로고침되지 않도록 하기

    if(data.userPw !== data.userPwChk) {
      alert("두 비밀번호가 다릅니다.")
      return;
    }

    if(confirm("제출하시겠습니까?")) {
      try {
        const response = await userService.signup(data);
        console.log('완료: ' + response.status);
        if(response.status === 200) {
          alert("가입이 완료되었습니다.")
          router.push('/login');
        }
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
        address: ''
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
          <div className="grid gap-6 mb-6">
            <InputText
              placeholder="User ID(Email)"
              name="userId"
              type="email"
              value={data.userId}
              onChange={handleInputChange}
              regExp="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            <InputText
              placeholder="Password"
              name="userPw"
              type="password"
              value={data.userPw}
              onChange={handleInputChange}
              regExp="^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,}$"
            />
            <InputText
              placeholder="Password Check"
              name="userPwChk"
              type="password"
              value={data.userPwChk || ''}
              onChange={handleInputChange}
              regExp="^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,}$"
            />
            <InputText
              placeholder="User Name"
              name="username"
              type="text"
              value={data.username}
              onChange={handleInputChange}
            />
            <InputText
              placeholder="Phone Number"
              name="phone"
              type="phone"
              value={data.phone || ''}
              onChange={handleInputChange}
            />
            <InputText
              placeholder="Address"
              name="address"
              type="text"
              value={data.address || ''}
              onChange={handleInputChange}
            />
            <div className="flex justify-evenly mt-5">
              <Button buttonName="Reset" onClick={handleReset}></Button>
              <Button buttonName="Back" onClick={handleLoginPage}></Button>
            </div>
            <div className="flex justify-evenly mt-5">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
