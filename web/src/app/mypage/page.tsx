"use client"

import { useUserInfo } from '@/lib/UserContext';
import { userService } from '@/services/user.service';
import { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { userContext } from '@/lib/UserContext';
import { createContext } from 'react';
import itemService from '@/services/item.service';
import { flushSync } from 'react-dom';

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
  const [itemList, setItemList] = useState<ItemListResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const openModal = (img: string) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const tab1 = [
    { index: 1, img: '/trees.png' },
    { index: 2, img: 'test2' },
    { index: 3, img: 'test3' },
    { index: 4, img: 'test4' },
    { index: 5, img: 'test5' },
    { index: 6, img: 'test6' },
    { index: 7, img: 'test7' },
    { index: 8, img: 'test8' },
    { index: 9, img: 'test9' },
  ];

  const tab2 = [
    { index: 1, img: 'test11' },
    { index: 2, img: 'test12' },
    { index: 3, img: 'test13' },
    { index: 4, img: 'test14' },
    { index: 5, img: 'test15' },
    { index: 6, img: 'test16' },
    { index: 7, img: 'test17' },
    { index: 8, img: 'test18' },
    { index: 9, img: 'test19' },
  ];

  const tab3 = [
    { index: 1, img: 'test21' },
    { index: 2, img: 'test22' },
    { index: 3, img: 'test23' },
    { index: 4, img: 'test24' },
    { index: 5, img: 'test25' },
    { index: 6, img: 'test26' },
    { index: 7, img: 'test27' },
    { index: 8, img: 'test28' },
    { index: 9, img: 'test29' },
  ];

  const tabs = [
    { label: 'Tab 1', content: 'tab1' },
    { label: 'Tab 2', content: 'tab2' },
    { label: 'Tab 3', content: 'tab3' },
  ];

  const ITEMS_PER_PAGE = 9;
  // 맨 처음 렌더링이 될 때에는 함수가 실행되지는 않고 정의만 된다.
  const getUserItems = useCallback(async (pageNumber: number) => {

    console.log('callback - getUserItems');
    console.log(user)
    if(!user) {
      return;
    }

    console.log(user)

    try {
      const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
      const response = await itemService.getUserItems(user.username, offset, ITEMS_PER_PAGE);

      console.log(response)

      // 전체 개수 < 해당 페이지 수
      // 페이지가 더 없음.
      if (response.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      flushSync(() => {
        if (pageNumber === 1) {
          setItemList(response);
        } else {
          // 기존꺼에 새로운 가져온 데이터를 추가해서 배열을 만들었음.
          // 여기서 참조를 했음. 이전의 것인 prevItems를 그대로 복사하고 거기에 response를 더했기 때문에 아예 새로 만들어진 것이라고 봄.
          // 그래서 아래 ItemList를 dependency로 하고 있는 useMemo가 동작을 하고 있는 것임.
          setItemList((prevItems) => [...prevItems, ...response]);
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  const sortedItemList = useMemo(() => {
    console.log('다시 가져옴');
    console.log(itemList);
    // itemList를 가져와서 sorting
    // id는 number 타입이므로 연산을 통해 오름차순으로 정렬함.
    return [...itemList].sort((a, b) => a.id - b.id);
  }, [itemList]);

  // 데이터 요청
  // 처음 렌더링되면 page가 useState로 초기화되니까 바로 된다.
  useEffect(() => {
    console.log('useEffect - getUserItems');
    if(user) {
      console.log('user 있음');
      getUserItems(page); // 컴포넌트가 마운트되면 데이터 요청 실행
    }
  }, [user, page, getUserItems]); // 마운트가 된다는 것은 dom에 추가되어 렌더링이 된다는 것

  useEffect(() => {
    console.log('Component rendered');
  }, [sortedItemList]);

  useEffect(() => {
    switch (tabs[activeTab].content) {
      case 'tab1':
        setTabData(tab1);
        break;
      case 'tab2':
        setTabData(tab2);
        break;
      case 'tab3':
        setTabData(tab3);
        break;
      default:
        setTabData([]);
    }
  }, [activeTab]);

  if (user === null) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div>Loading...</div> {/* 로딩 상태 표시 */}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col w-screen h-screen">
        <div className="flex flex-col w-full h-full">
          <div className="flex w-full h-[20%] mt-9">
            <div className="flex border-2 w-[32%] justify-center items-center">
              <div className="w-[80%] h-[80%] rounded-full border-2"></div>
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
              <div className="flex flex-wrap w-full h-full">
                {sortedItemList.map((item, index) => (
                  <div
                    key={item.index}
                    className="w-1/3 h-1/3 border-2"
                    onClick={() => openModal(item.itemImg)}
                  >
                    {/* <div> */}
                    <img
                      src={`/testImages/${item.itemImg}`}
                      className="w-full h-full"
                    />
                    {/* </div> */}
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
  );
}
