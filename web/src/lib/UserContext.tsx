// lib/UserContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { LoginResponse } from '@/types/user/type';

interface UserContextType {
  user: LoginResponse | null;
  setUser: (user: LoginResponse | null) => void;  
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  // 앱 시작할 때 localStorage에서 유저 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 상태가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
