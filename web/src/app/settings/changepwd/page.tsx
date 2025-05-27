'use client';

import { useUserInfo } from '@/lib/UserContext';
import { userService } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import InputText from '@/components/InputText';
import TestModal, { ModalRef } from '@/components/modal/TestModal';
import { UserInfoResponse } from '@/types/user/type';
import Button from '@/components/common/Button';


export default function Settings() {
  const router = useRouter();
  const { user, setUser } = useUserInfo();
  const modalRef = useRef<ModalRef>(null);
  const [ userInfo, setUserInfo ] = useState<UserInfoResponse>();
  const [formData, setFormData] = useState({
    nowPwd: '',
    newPwd: '',
    newPwdConfirm: '',
  });
  const [userData, setUserData] = useState({
    userId: user?.userId,
    username: user?.username,
    phone: user?.phone,
    address: user?.address
  });

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      try {
        const response = await userService.logout();
        alert(response.message);
        // 로컬 스토리지에서 사용자 정보 삭제
        localStorage.removeItem('userInfo');
        // 로그아웃을 하고 나면 뒤로 갈 수 없어야 해서 replace 사용
        router.replace('/login');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getUser = async () => {
    if(!user) return;
    
    try {
      const param = {
        userId: user.userId,
      };

    // user 정보 가져오는 api 호출
    const response = await userService.user(param);

    // 필요한 데이터만 UserInfo에 가져다가 사용함.
    const data = {
      userId: response.data.userId,
      username: response.data.username,
      phone: response.data.phone,
      address: response.data.address,
    };

    console.log(data);
    // 로컬 스토리지 정보
    setUserInfo(data);
    setUserData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // localstorage에 user 정보가 없거나 이미 불러왔으면 return
    if(!user || userInfo) {
      return;
    } else {
      getUser();
    }
  }, [user]);

  // 회원 정보 수정
  const handleEditUserInfo = async () => {
    if(confirm("회원 정보를 수정하시겠습니까?")) {
      try {
        const param = {
          userId: userData.userId,
          username: userData.username,
          phone: userData.phone,
          address: userData.address,
        };

        // user 정보 가져오는 api 호출
        const response = await userService.editUserInfo(param);

        if(response.status === 200) {
          // 필요한 데이터만 UserInfo에 가져다가 사용함.
          const data = {
            userId: response.data.userId,
            username: response.data.username,
            phone: response.data.phone,
            address: response.data.address,
          };

          setUserInfo(data);
          alert(response.data.message)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const openChangdPwdModal = () => {
    modalRef.current.open();
  };

  const handleBackPage = () => {
    router.back();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData])

  return !userInfo ? (
    <div className="flex w-screen h-screen justify-center items-center">
      <div>Loading...</div>
    </div>
  ) : (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col w-[50%] h-[50%] justify-around">
        <form>
          <div className="flex justify-center mb-3">
            <span className="text-3xl">비밀번호 변경</span>
          </div>
          <div>
            <InputText
              id="nowPwd"
              placeholder="현재 비밀번호"
              name="nowPwd"
              type="password"
              menuName="현재 비밀번호"
              // value=""
              // defaultValue={userInfo.userId}
              onChange={handleInputChange}
            />
            <InputText
              id="newPwd"
              placeholder="새로운 비밀번호"
              name="newPwd"
              type="password"
              menuName="새로운 비밀번호"
              // value=""
              // defaultValue={userInfo.username}
              onChange={handleInputChange}
            />
            <InputText
              id="newPwdConfirm"
              placeholder="새로운 비밀번호 확인"
              name="newPwdConfirm"
              type="password"
              menuName="새로운 비밀번호 확인"
              // value=""
              // defaultValue={userInfo.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-center mt-10">
            <Button buttonName="변경" onClick={handleEditUserInfo}></Button>
            <Button buttonName="뒤로가기" onClick={handleBackPage}></Button>
          </div>
        </form>
      </div>
    </div>
  );

}
