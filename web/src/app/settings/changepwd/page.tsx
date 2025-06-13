'use client';

import { useUserInfo } from '@/hook/UserContext';
import { userService } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import InputText from '../../../components/InputText';
import { UserInfoData, UserInfoResponse } from '@/types/user/type';
import Button from '@/components/common/Button';


export default function Settings() {
  const router = useRouter();
  const { user, setUser } = useUserInfo();
  const [ userInfo, setUserInfo ] = useState<UserInfoData>();
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

  const checkPwdRegex = (pwd: string): boolean => {
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return pwdRegex.test(pwd)
}
        

  const getUser = async () => {
    if(!user) return;
    
    try {
      const param = {
        userId: user?.userId,
      };

    // user 정보 가져오는 api 호출
    const response = await userService.user(param);


    if(!response) {
      return <div>데이터가 없습니다.</div>
    }

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

  // 비밀번호 수정
  const handleEditPwd = async () => {
    if(confirm("비밀번호를 수정하시겠습니까?")) {
      try {
        const param = {
          userId: user?.userId,
          nowPwd: formData.nowPwd,
          newPwd: formData.newPwd,
          newPwdConfirm: formData.newPwdConfirm,
        };


        if (!checkPwdRegex(formData.newPwd) || !checkPwdRegex(formData.newPwdConfirm)) {
          alert("비밀번호 형식이 잘못되었습니다. (영문 소문자, 대문자, 숫자, 특수문자 조합으로 최소 8자리 이상)")
          return;
        }

        if (formData.newPwd !== formData.newPwdConfirm) {
          alert('두 비밀번호가 다릅니다.');
          return;
        }

        console.log(param)

        // user 정보 가져오는 api 호출
        const response = await userService.editUserPwd(param);

        if(response.success) {
          console.log('response: ' + response.success);
          alert(response.message)
        } else {
          alert(response.message)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleBackPage = () => {
    router.back();
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

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
          <div className="flex justify-center">
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
            <Button buttonName="변경" onClick={handleEditPwd}></Button>
            <Button buttonName="뒤로가기" onClick={handleBackPage}></Button>
          </div>
        </form>
      </div>
    </div>
  );

}
