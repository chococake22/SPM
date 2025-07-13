import UserPhoto from '../user/UserPhoto';
import Link from 'next/link';
import { getUserIdFromUsername } from '@/lib/userUtils';
import { useState, useEffect } from 'react';
import itemService from '@/services/item.service';

interface ItemUserProfileProps {
  profileImg?: string;
  id: string;
  username?: string;
}

  // 페이지당 사진 개수
  const ITEMS_PER_PAGE = 3;

const ItemUserProfile: React.FC<ItemUserProfileProps> = ({ profileImg, id, username }) => {
  const [userIdForUrl, setUserIdForUrl] = useState<string>(id);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserId = async (pageNumber: number) => {
      try {
        
        const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
        const response = await itemService.getUserItems(
          id,
          offset,
          ITEMS_PER_PAGE
        );
        // setUserIdForUrl(actualUserId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        // setUserIdForUrl(userId); // fallback to original userId
      } finally {
        setIsLoading(false);
      }
    };

    // fetchUserId(number);
  }, [id]);

  
  if (!isLoading) {
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
          {username}
        </Link>
      </div>
    </div>
  );
};

export default ItemUserProfile;
