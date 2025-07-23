"use client"

import UserProfilePage from '@/components/user/UserProfilePage';
import { useUserInfo } from '@/hook/UserContext';
import LoadingBar from '@/components/common/LoadingBar';

// 접속한 유저의 프로필 페이지
export default function Mypage() {
  // 현재 접속한 유저 정보 불러오기
  const { user, isLoading, isInitialized } = useUserInfo();

  // 로딩 중
  if (!isInitialized || isLoading || !user) {
    return (
      <LoadingBar />
    );
  }

  // 로그인된 사용자 정보 표시
  return <UserProfilePage targetUser={user} thisPage="mypage" />;
}
