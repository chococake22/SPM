"use client"

import UserProfilePage from '@/components/user/UserProfilePage';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userService } from '@/services/user.service';
import { useUserInfo } from '@/hook/UserContext';
import { UserData } from '@/types/user/type';
import LoadingBar from '@/components/common/LoadingBar';

export default function UserProfile() {
  const { id } = useParams();
  const [targetUser, setTargetUser] = useState<UserData | null>(null);
  const { user, setUser, isLoading } = useUserInfo();
  
  useEffect(() => {
    const fetchUser = async () => {
      const response = await userService.findUserById(id as string);
      if(response.data) {
        setTargetUser(response.data);
      }
    }
    fetchUser();
  }, [])

    if (isLoading || !user || !targetUser) {
      return <LoadingBar />;
    }

  return <UserProfilePage targetUser={targetUser} thisPage="user" />;
};