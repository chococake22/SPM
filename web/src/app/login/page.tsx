"use client"

import { FormEvent, useEffect, useState } from 'react';
import InputText from "@/components/InputText";
import { noauthService } from '@/services/noauth.service';
import { LoginForm, LoginResponse } from '@/types/user/type';
import { useRouter } from 'next/navigation';
import { useUserInfo} from '@/hook/UserContext';
import Button from '@/components/common/Button';
import useUserInfo2 from '@/hook/UseUserInfo2';

const LoginPage = () => {
  const { setUser } = useUserInfo();
  const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserInfo } = useUserInfo2();

  const handleSignup = () => {
    router.push('/signup');
  };

  // 로그인 제출
  const handleLogin = async (e: FormEvent) => {
    // 자동으로 새로고침되어서 한번 더 요청이 나가는 것을 방지한다.
    e.preventDefault();

    // FormData를 이용해서 name에 정의된 값을 가져온다.
    const formData = new FormData(e.target as HTMLFormElement);
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
      const response = await noauthService.login(params);
      if(response.userId) {
        setUserInfo(response);
        setUser(response)
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleLoginTest = async () => {
    console.log('??????????');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.ok) {
      alert('로그인 성공!');
      window.location.href = '/dashboard'; // 원하는 페이지로 이동
    } else {
      alert('로그인 실패!');
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div>
        <div className="flex justify-center mb-4">
          <span className="text-xl">Login</span>
        </div>
        <form id="loginForm" onSubmit={handleLogin} method="POST">
          <div>
            <InputText placeholder="User ID(Email)" name="userId" type="text" />
          </div>
          <div className="mt-3">
            <InputText placeholder="Password" name="userPw" type="password" />
          </div>
          <div className="flex justify-evenly mt-5">
            <Button buttonName="Login" type="submit"></Button>
            <Button buttonName="SignUp" onClick={handleSignup}></Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
