"use client"

import { useUserInfo } from '@/hook/UserContext';
import { userService } from '@/services/user.service';
import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { UserContext } from '@/hook/UserContext';
import { createContext } from 'react';
import itemService from '@/services/item.service';
import { flushSync } from 'react-dom';
import { ItemListResponse, Item } from '@/types/item/type';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Mypage() {
  const { user, setUser } = useUserInfo();
  const [activeTab, setActiveTab] = useState(0);
  const [tabData, setTabData] = useState<{ index: number; img: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemList, setItemList] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isTest, setIsTest] = useState<boolean>(false);
  const [num, setNum] = useState<number>(0);

  const openModal = (img: string) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const tabs = [
    { label: '내 사진', content: 'tab1' },
    { label: '랜덤보기', content: 'tab2' },
    { label: '제목 없음', content: 'tab3' },
  ];

  // 페이지당 사진 개수
  const ITEMS_PER_PAGE = 9;

  /**
   * useCallback을 사용하고 두 번째 인자로 빈 배열을 넣음
   * 그럴 경우 컴포넌트가 처음 렌더링이 될 때 한 번만 함수를 만들고 이후에는 그걸 재사용함
   * 그래서 isTest는 맨 처음에 선언된 false이고, user도 처음엔 값이 없기 때문에 null이 되는 것임.
   */
  const getUserItems = useCallback(
    async (pageNumber: number) => {
      console.log('callback - getUserItems');
      console.log(isTest);
      console.log(user);
      if (!user) {
        return;
      }

      try {
        const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
        const response = await itemService.getUserItems(
          user.username,
          offset,
          ITEMS_PER_PAGE
        );

        if (!response?.data) {
          return <div>없습니다</div>
        }
          if (response.data.length < ITEMS_PER_PAGE) {
            // 전체 개수 < 해당 페이지 수
            // 페이지가 더 없음.
            setHasMore(false);
          };

        flushSync(() => {
          const items = response.data ?? [];
          if (!items) return; // undefined일 경우 아무 작업도 하지 않음

          if (pageNumber === 1) {
            console.log(items);
            setItemList(items);
          } else {
            setItemList((prevItems) => [...prevItems, ...items]);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    [user, page, num]
  );

  const prevRef = useRef<typeof getUserItems | null>(null);

  useEffect(() => {
    if (prevRef.current !== getUserItems) {
      console.log('🆕 getUserItems 함수가 새로 만들어졌습니다.');
    } else {
      console.log('✅ getUserItems 함수는 이전과 동일합니다.');
    }
    prevRef.current = getUserItems;
  }, [getUserItems]);

  const sortedItemList = useMemo(() => {
    console.log('다시 가져옴');
    if (itemList && Array.isArray(itemList)) {
      // itemList를 가져와서 sorting
      // id는 number 타입이므로 연산을 통해 오름차순으로 정렬함.
      return [...itemList].sort((a, b) => a.id - b.id);
    }
  }, [itemList]);

  // 데이터 요청
  // 처음 렌더링되면 page가 useState로 초기화되니까 바로 된다.
  useEffect(() => {
    console.log('useEffect - getUserItems');
    if (user) {
      console.log('user 있음');
      setIsTest(true);
      getUserItems(page); // 컴포넌트가 마운트되면 데이터 요청 실행
    }
  }, [user, page]); // 마운트가 된다는 것은 dom에 추가되어 렌더링이 된다는 것

  return (
    user && (
      <div className="flex flex-col h-screen justify-center items-center max-w-lg">
        <div className="flex flex-col h-screen w-full">
          <div className="flex flex-col w-full h-full">
            <div className="flex w-full h-[20%]">
              <div className="flex flex-col gap-2 border-2 w-[32%] justify-center items-center">
                <div className="flex w-[60%] h-[60%] rounded-full overflow-hidden border-[1px]">
                  {user?.profileImg && (
                    <img
                      src={`${user.profileImg}`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div>
                  <span>{user?.username}</span>
                </div>
              </div>
              <div className="flex border-2 w-[70%] justify-around items-center">
                <div className="border-2">
                  <div>게시물</div>
                  <div className="flex items-center justify-center">
                    <span>89</span>
                  </div>
                </div>
                <div className="border-2">
                  <div>팔로잉</div>
                  <div className="flex items-center justify-center">
                    <span>89</span>
                  </div>
                </div>
                <div className="border-2">
                  <div>팔로워</div>
                  <div className="flex items-center justify-center">
                    <span>89</span>
                  </div>
                </div>
              </div>
            </div>
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
              <div className="w-full h-full">
                <div className="grid grid-cols-3">
                  {sortedItemList?.map((item, index) => (
                    <div
                      key={index}
                      className="w-full h-[200px] border-2 box-border border-2"
                      onClick={() => openModal(item.itemImg)}
                    >
                      <img
                        src={`/testImages/${item.itemImg}`}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                {selectedImage && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
                    onClick={closeModal}
                  >
                    <div className="bg-white rounded-lg p-4 max-w-[90%] max-h-[90%] relative">
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">
                        &times;
                      </button>
                      <img
                        src={`/testImages/${selectedImage}`}
                        className="max-w-full max-h-[80vh] object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
