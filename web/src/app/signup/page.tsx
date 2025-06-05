"use client"

import { FormEvent, useState } from 'react';
import InputText from "@/components/InputText";
import { userService } from '@/services/user.service';
import { SignupRequest } from '@/types/user/type';
import { useRouter } from 'next/navigation';
import Button from '../../components/common/Button';
import { noauthService } from '@/services/noauth.service';




const SignUpPage = () => {
  const router = useRouter();
  const [isCheckUserId, setIsCheckUserId] = useState<boolean>(false);
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

    // 이메일 형식 및 중복 체크
    if(!isCheckUserId) {
      alert("아이디 중복 체크를 해주세요.")
      return;
    }

    console.log(!isValidPwd(data.userPw));
    console.log(!isValidPwd(data.userPwChk));
    console.log(data.userPw !== data.userPwChk);

    if (
      !isValidPwd(data.userPw) ||
      !isValidPwd(data.userPwChk) ||
      data.userPw !== data.userPwChk
    ) {
      alert(
        '두 비밀번호가 일치하지 않거나 형식이 맞지 않습니다. (영문 소문자, 숫자, 특수문자 조합으로 최소 8자 이상)'
      );
      return;
    }

    if(confirm("가입하시겠습니까?")) {
      try {
        const response = await noauthService.signup(data);
        if(response.status === 201) {
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
      setIsCheckUserId(false)
    }
  };

  const handleLoginPage = () => {
    router.push('/login');
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPwd = (pwd: string): boolean => {
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return pwdRegex.test(pwd);
  };

  const handleCheckUserIdExist = async () => {
    if (!data.userId) {
      alert('아이디를 입력하세요.');
      return;
    }

    if (!isValidEmail(data.userId)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }

    try {
      const response = await noauthService.checkUserIdExist(data.userId);
      // console.log("userId: " + response.data.userId)      
      if(response.data?.userId) {
        alert('이미 존재하는 아이디입니다.');
        setIsCheckUserId(false);
      } else {
        alert('사용할 수 있는 아이디입니다.');
        setIsCheckUserId(true);
      }

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div>
        <div className="flex justify-center mb-4">
          <span className="text-xl">Sign Up</span>
        </div>
        <form onSubmit={handleSubmit} method="POST">
          <div className="grid gap-3 mb-6">
            <InputText
              placeholder="User ID(Email)"
              name="userId"
              type="email"
              value={data.userId}
              onChange={handleInputChange}
              regExp="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            <div>
              <Button
                buttonName="중복 체크"
                onClick={handleCheckUserIdExist}
              ></Button>
            </div>
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
