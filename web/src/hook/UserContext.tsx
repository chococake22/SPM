'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { UserData } from '@/types/user/type';
import { jwtUtils } from '@/lib/auth';

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isLoading: boolean; // 로딩 상태 추가
}

/**
 * createContext를 이용해서 Context 객체를 생성함.
 * Context 객체는 UserContextType 또는 undefined를 받는다.
 */
export const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider를 이용해서 맨 상위로 접근, 전체를 감싼다.
 * 하위 컴포넌트에서 전역으로 상태 접근 가능
 */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
  }, []);

  // 앱 시작할 때 localStorage에서 유저 불러오기
  useEffect(() => {
    if (isFirstLoad) {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken);

      if (accessToken) {
        const isValid = jwtUtils.isTokenValid(accessToken);
        console.log(isValid);
        if (isValid) {
          const user = jwtUtils.getUserFromToken(accessToken);
          console.log(user);
          if (user) {
            setUserState(user as UserData);
          }
        }
      }

      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  const setUser = (user: UserData | null) => {
    setUserState(user);
  };

  // 로딩 중일 때는 기본 UI 표시
  if (isLoading) {
    return (
      <UserContext.Provider value={{ user: null, setUser, isLoading: true }}>
        {children}
      </UserContext.Provider>
    );
  }

  // return이 JSX 형태라서 이렇게 .tsx 파일로 작성함.
  return (
    <UserContext.Provider value={{ user, setUser, isLoading: false }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 *  전역에서 UserContext를 어디서든 사용할 수 있도록 커스텀 훅을 정의했음.
 *  useContext를 이용해서 하위 컴포넌트 어디에서든디 user 정보에 접근이 가능함
 *  UserContextType에 정의된 값들을 사용할 수 있음.
 *  단, UserProvider 외부에서 이 훅을 사용하려고 하면 context가 undefined가 되므로,
 *  그 경우 명시적으로 에러를 던져 잘못된 사용을 방지함.
 */
export const useUserInfo = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserInfo must be used within a UserProvider');
  }
  return context;
};
