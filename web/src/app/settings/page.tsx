'use client';

import { userService } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { UserInfoData, LogoutRequest } from '@/types/user/type';

import Link from 'next/link';
import Swal from 'sweetalert2';
import { noauthService } from '@/services/noauth.service';
import { useUserInfo } from '@/hook/UserContext';

export default function Settings() {
  const router = useRouter();
  const { user, setUser } = useUserInfo();
  const [userInfo, setUserInfo] = useState<UserInfoData>();
  const [param, setParam] = useState<LogoutRequest>();
  const [userData, setUserData] = useState({
    userId: user?.userId,
    username: user?.username,
    phone: user?.phone,
    address: user?.address,
  });

  useEffect(() => {
    setParam({
      userId: user?.userId,
    });
  }, [user]);

  const handleLogout = async () => {
    try {

      const response = await noauthService.logout(param);
      if (response && response.success) {
        // alert(response.message);
        // 로컬 스토리지에서 사용자 정보 삭제
        localStorage.removeItem('user');
        // 로그아웃을 하고 나면 뒤로 갈 수 없어야 해서 replace 사용
        router.replace('/login');
      } else {
        alert(response?.message)
      }
    } catch (error) {
      console.error(error);
      alert('네트워크 오류로 로그아웃하지 못했습니다.');
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

      if (
        response?.data &&
        response.data.userId &&
        response.data.username &&
        response.data.phone &&
        response.data.address
      ) {
        // 필요한 데이터만 UserInfo에 가져다가 사용함.
        const data: UserInfoData = {
          userId: response.data.userId,
          username: response.data.username,
          phone: response.data.phone,
          address: response.data.address,
        };

        // 로컬 스토리지 정보
        setUserInfo(data);
        setUserData(data);
      } else {
        alert(response?.message || '유저 정보를 불러오지 못했습니다.');
      }

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

  const handleClick = () => {
    Swal.fire({
      title: '로그아웃하시겠습니까?',
      // text: '이 작업은 되돌릴 수 없습니다!',
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소',
      confirmButtonColor: '#ef4444', // Tailwind red-500
      cancelButtonColor: '#9ca3af', // Tailwind gray-400
      customClass: {
        popup: 'w-[70%] h-[40%]', // Tailwind로 가로 300px, 세로 200px 설정
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('로그아웃 완료!');
        handleLogout();
      }
    });
  };

  return (
    <div className="flex w-full max-w-lg  items-center px-4">
      {/* Section 1: 계정 */}
      <div className='w-full'>
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            계정
          </h2>
          <ul className="bg-white rounded-xl divide-y">
            <li className="flex items-center justify-between px-4 py-3">
              <span>아이디(이메일)</span>
              <span className="text-sm text-gray-500">{user?.userId}</span>
            </li>
            <li className="flex items-center justify-between px-4 py-3">
              <span>닉네임</span>
              <span className="text-sm text-gray-500">{user?.username}</span>
            </li>
            <li className="flex items-center justify-between px-4 py-3">
              <Link
                href="/settings/myinfo"
                className="flex justify-between items-center w-full"
              >
                <span>사용자 정보</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
            <li className="flex items-center justify-between px-4 py-3">
              <Link
                href="/settings/changepwd"
                className="flex justify-between items-center w-full"
              >
                <span>비밀번호 변경</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            앱 설정
          </h2>
          <ul className="bg-white rounded-xl divide-y">
            <li className="flex items-center justify-between px-4 py-3">
              <span>알림</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600"></div>
              </label>
            </li>
            <li className="flex items-center justify-between px-4 py-3">
              <span>다크 모드</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-800"></div>
              </label>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            보안
          </h2>
          <ul className="bg-white rounded-xl divide-y">
            <li className="flex items-center justify-between px-4 py-3">
              <span>2단계 인증</span>
              <span className="text-sm text-gray-500">사용 안함</span>
            </li>
            <li className="flex items-center justify-between px-4 py-3">
              <span>앱 잠금</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500"></div>
              </label>
            </li>
          </ul>
        </div>

        {/* Section 4: 기타 */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            기타
          </h2>
          <ul className="bg-white rounded-xl divide-y">
            <li className="flex items-center justify-between px-4 py-3">
              <span>버전 정보</span>
              <span className="text-sm text-gray-500">v1.2.3</span>
            </li>
            <li
              className="flex items-center justify-between px-4 py-3 text-red-600 font-semibold cursor-pointer"
              onClick={handleClick}
            >
              <span>로그아웃</span>
            </li>
            <li className="flex items-center justify-between px-4 py-3 text-red-600 font-semibold cursor-pointer">
              <span>계정 삭제</span>
            </li>
          </ul>
        </div>
        {/* <button
        onClick={handleClick}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
      >
        삭제하기
      </button> */}
      </div>
    </div>
  );

}
