'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { UserData } from '@/types/user/type';
import { jwtUtils } from '@/lib/auth';

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isLoading: boolean; // 로딩 상태 추가
  isInitialized: boolean;
  updateUserFromToken: () => void;  
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // 로그인 후에 토큰이 로컬 스토리지로 옮겨지면 그 때 함수를 실행해서 유저 정보를 업데이트함.
  const updateUserFromToken = () => {
    console.log('updateUserFromToken');
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const isValid = jwtUtils.isTokenValid(accessToken);
        if (isValid) {
          const user = jwtUtils.getUserFromToken(accessToken);
          if(user) {
            setUserState(user as UserData);
          }
        }
      }
    } catch (error) {
      console.error('Error updating user from token:', error);
    }
  };

  // 앱 시작할 때 localStorage에서 유저 불러오기
  useEffect(() => {
    const initializeUser = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          const isValid = jwtUtils.isTokenValid(accessToken);

          if (isValid) {
            const user = jwtUtils.getUserFromToken(accessToken);

            if (user) {
              setUserState(user as UserData);
              console.log('User set successfully');
            }
          } else {
            localStorage.removeItem('accessToken');
          }
        } else {
          console.log('No access token found');
        }
      } catch (error) {
        console.error('UserContext initialization error:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        setHasInitialized(true);
        console.log('=== UserContext Initialization Complete ===');
      }
    };

    // 클라이언트에서만 실행
    if (typeof window !== 'undefined') {
      console.log('client');
      if (!hasInitialized) {
        initializeUser();
      }
    } else {
      // 서버에서는 바로 로딩 완료
      setIsLoading(false);
      setIsInitialized(true);
      setHasInitialized(true);
    }
  }, []);

  const setUser = (user: UserData | null) => {
    setUserState(user);
  };

  // 로딩 중일 때는 기본 UI 표시
  if (isLoading) {
    return (
      <UserContext.Provider value={{ user: null, setUser, isLoading: true, isInitialized, updateUserFromToken }}>
        {children}
      </UserContext.Provider>
    );
  }

  // return이 JSX 형태라서 이렇게 .tsx 파일로 작성함.
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading: false,
        isInitialized,
        updateUserFromToken,
      }}
    >
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
