import UserPhoto from '../user/UserPhoto';
import Link from 'next/link';
import { getUserIdFromUsername } from '@/lib/userUtils';
import { useState, useEffect } from 'react';

interface ItemUserProfileProps {
  profileImg: string;
  userId: string;
}

const ItemUserProfile: React.FC<ItemUserProfileProps> = ({ profileImg, userId }) => {
  const [userIdForUrl, setUserIdForUrl] = useState<string>(userId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const actualUserId = await getUserIdFromUsername(userId);
        setUserIdForUrl(actualUserId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUserIdForUrl(userId); // fallback to original userId
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center w-full h-[5vh]">
        <div className="w-[12%] h-full">
          <div className="w-full h-full flex items-center justify-center">
            <UserPhoto imageInfo={profileImg} />
          </div>
        </div>
        <div className="ml-2 text-xl text-gray-400">
          로딩 중...
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center w-full h-[7vh]">
      <div className="w-[12%] h-full">
        <div className="w-full h-full flex items-center justify-center">
          <UserPhoto imageInfo={profileImg} />
        </div>
      </div>
      <div>
        <Link 
          href={`/user/${userIdForUrl}`}
          className="ml-2 text-xl hover:text-blue-500 transition-colors cursor-pointer"
        >
          {userId}
        </Link>
      </div>
    </div>
  );
};

export default ItemUserProfile;
