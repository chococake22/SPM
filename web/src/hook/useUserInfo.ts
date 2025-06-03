import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface userInfoType {
  userId: string | undefined;
  status?: number | undefined;
  redirectUrl?: string | undefined;
  username?: string | undefined;
  phone?: string | undefined;
  address?: string | undefined;
}

interface UserInfoState {
    userInfo: userInfoType
}

interface UserInfoActions {
    setUserInfo: (userinfo: userInfoType) => void;
    deleteUserInfo: () => void;
}

const defaultState = { userId: '', username: '', phone: '', address: ''}

/**
 * persist를 이용해서 로컬 스토리지에 user 정보 저장(안하면 새로고침 시 정보 없어짐)
 */
const useUserInfo2 = create<UserInfoState & UserInfoActions>()(
  persist(
      (set) => ({
      userInfo: defaultState,
      setUserInfo: (userInfo: userInfoType) => {
        set({ userInfo });
      },
      deleteUserInfo: () => {
        set({ userInfo: defaultState });
      },
    }),
    {
      name: 'user-zustand'
    }
  )
);

export default useUserInfo2;