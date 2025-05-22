'use client';

import { useUserInfo } from '@/lib/UserContext';
import { userService } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import InputText from '@/components/InputText';
import TestModal, { ModalRef } from '@/components/TestModal';
import { UserInfoResponse } from '@/types/user/type';
import Button from '../../components/common/Button';

export default function Settings() {
  const router = useRouter();
  const { user, setUser } = useUserInfo();
  const [ userInfo, setUserInfo ] = useState<UserInfoResponse>();
  const [ isClicked, setIsClicked] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<ModalRef>(null);

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

  const changeModal = () => {
    if(isClicked) {
      setIsClicked(false)
    } else {
      setIsClicked(true)
    }
  };

  const inputGogo = () => {
    inputRef.current.focus();
  }

  // const closeModal = () => {
  //   setIsClicked(false)
  // }

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
    };

    console.log(data);
    setUserInfo(data);
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


  const gogoModal = () => {
    modalRef.current?.open()
  };


  return !userInfo ? (
    <div className="flex w-screen h-screen justify-center items-center">
      <div>Loading...</div>
    </div>
  ) : (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col w-[50%] h-[30%] justify-around">
        <div>
          <InputText
            placeholder="User ID(Email)"
            name="userId"
            type="text"
            defaultValue={userInfo.userId}
          />
          <InputText
            placeholder="User Name"
            name="username"
            type="text"
            defaultValue={userInfo.username}
          />
          <InputText
            placeholder="Phone"
            name="phone"
            type="text"
            defaultValue={userInfo.phone}
          />
        </div>
        <Button buttonName="Logout" onClick={handleLogout}></Button>
        <Button buttonName="InnerDOM" onClick={changeModal}></Button>
        <Button buttonName="ChildDOM" onClick={gogoModal}></Button>

        {isClicked && <input ref={inputRef} className="border-2"></input>}
        <TestModal ref={modalRef} />
      </div>
    </div>
  );

}
