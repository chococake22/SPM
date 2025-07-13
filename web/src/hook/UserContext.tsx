'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { UserData } from '@/types/user/type';

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
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

  // 앱 시작할 때 localStorage에서 유저 불러오기
  useEffect(() => {
    if (isFirstLoad) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
      }
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    if (user) {
      const userJson = JSON.stringify(user); // ✅ user 전체 저장, 
      localStorage.setItem('user', userJson); // user가 변경이 되면 localStorage에 저장된 user 정보도 변경됨.
    }
  }, [user]);

  const setUser = (user: UserData | null) => {
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
