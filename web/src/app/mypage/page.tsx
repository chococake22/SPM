"use client"

import { useUserInfo } from '@/lib/UserContext';
import { userService } from '@/services/user.service';
import { useContext, useEffect, useState } from 'react';
import { userContext } from '@/lib/UserContext';
import { createContext } from 'react';

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
  const [tabData, setTabData] = useState<{index: number; img: string}[]>([]);

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

  useEffect(() => {
    switch(tabs[activeTab].content) {
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
          setTabData([])
    }
  }, [activeTab])

  useEffect(() => {
    const getUser = async () => {
      if (!user) return;
      try {
        const param = {
          userId: user.userId,
        };

        const response = await userService.user(param);
        console.log(response);
        // setUser(response.userDb);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [setUser]);

  if (!user) {
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
                {tabData.map((item, index) => (
                  <div
                    key={item.index}
                    className="w-1/3 h-1/3 border-2"
                  >
                    {/* <div> */}
                    <img src={`/testImages/${item.img}`} className='w-full h-full' />
                    {/* </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
