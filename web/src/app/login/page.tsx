"use client"

import { FormEvent } from 'react';
import InputText from "@/components/InputText";
import { noauthService } from '@/services/noauth.service';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';


const LoginPage = () => {
  const router = useRouter();

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
      if (response.success && response.data) {
        if(response.data.tokens.accessToken && response.data.tokens.refreshToken) {
          localStorage.setItem('accessToken', response.data.tokens.accessToken);
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
          router.push('/');
        }
      } else {
        alert(response.message)
      }
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
