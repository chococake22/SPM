"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import itemService from '@/services/item.service';
import { Item } from '@/types/item/type';
import { useUserInfo } from '@/hook/UserContext';
import UserPhoto from '@/components/user/UserPhoto';
import { flushSync } from 'react-dom';

interface UserProfile {
  id: string;
  username: string;
  profileImg: string;
  itemCount: number;
}

const UserProfilePage = () => {
  const params = useParams();
  const userId = params.id as string; // URL의 id 파라미터
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { user } = useUserInfo();
  const itemGridScrollContainerRef = useRef<HTMLDivElement>(null);

  // 페이지당 아이템 개수
  const ITEMS_PER_PAGE = 12;

  const tabs = [
    { label: '게시물', content: 'posts' },
    { label: '저장됨', content: 'saved' },
    { label: '태그됨', content: 'tagged' },
  ];

  const getUserItems = useCallback(
    async (pageNumber: number) => {
      try {
        const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
        const response = await itemService.getUserItems(userId, offset, ITEMS_PER_PAGE);
        
        console.log('API Response:', response);
        
        if (!response?.data) {
          return;
        }

        // 더 이상 데이터가 없으면 hasMore를 false로 설정
        if (response.data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        flushSync(() => {
          const items = response.data ?? [];
          if (!items) return;

          if (pageNumber === 1) {
            setUserItems(items);
          } else {
            setUserItems((prevItems) => [...prevItems, ...items]);
          }
        });

        // 첫 번째 페이지에서 사용자 정보 설정
        if (pageNumber === 1 && response.data.length > 0) {
          const firstItem = response.data[0];
          setUserProfile({
            id: userId,
            username: firstItem.username,
            profileImg: firstItem.profileImg,
            itemCount: response.data.length,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const loadMoreItems = useCallback(() => {
    console.log('loadMoreItems called, current page:', page);
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, hasMore]);

  const sortedItemList = useMemo(() => {
    if (!Array.isArray(userItems)) return [];
    return [...userItems].sort((a, b) => a.id - b.id);
  }, [userItems]);

  // 데이터 요청
  useEffect(() => {
    console.log('getUserItems');
    getUserItems(page);
  }, [page, getUserItems]);

  // 무한 스크롤 - 스크롤 이벤트 사용
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 // 100px 전에 미리 감지
      ) {
        console.log('Scroll near bottom, loading more items');
        if (hasMore) {
          loadMoreItems();
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore, loadMoreItems]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">사용자를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-lg pt-10 pb-12">
      {/* 사용자 프로필 헤더 */}
      <div className="flex w-full h-[20%]">
        <div className="flex flex-col gap-2 border-2 w-[32%] justify-center items-center">
          <div className="flex w-[60%] h-[60%] rounded-full overflow-hidden border-[2px]">
            <UserPhoto 
              imageInfo={userProfile.profileImg} 
              size="large"
            />
          </div>
          <div>
            <span>{userProfile.username}</span>
          </div>
          {user?.id === userId && (
            <div className="mt-2">
              <button className="text-sm text-blue-500 hover:text-blue-700 underline">
                프로필 편집
              </button>
            </div>
          )}
        </div>
        <div className="flex border-2 w-[70%] justify-around items-center">
          <div className="border-2">
            <div>게시물</div>
            <div className="flex items-center justify-center">
              <span>{userProfile.itemCount}</span>
            </div>
          </div>
          <div className="border-2">
            <div>팔로잉</div>
            <div className="flex items-center justify-center">
              <span>0</span>
            </div>
          </div>
          <div className="border-2">
            <div>팔로워</div>
            <div className="flex items-center justify-center">
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="w-full h-full">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex justify-around" aria-label="Tabs">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
                  ${
                    activeTab === index
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  focus:outline-none`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 아이템 그리드 */}
        <div
          className="flex flex-col w-full overflow-y-auto"
          ref={itemGridScrollContainerRef}
        >
          <div className="grid grid-cols-3">
            {sortedItemList?.map((item, index) => (
              <div
                key={index}
                className="w-full h-[200px] border-2 box-border hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/itemImg/${item.itemImg}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* 로딩 상태 표시 */}
          {hasMore && (
            <div className="h-20 flex items-center justify-center">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 