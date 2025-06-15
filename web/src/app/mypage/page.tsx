"use client"

import { userService } from '@/services/user.service';
import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { UserContext } from '@/hook/UserContext';
import { createContext } from 'react';
import itemService from '@/services/item.service';
import { flushSync } from 'react-dom';
import { ItemListResponse, Item } from '@/types/item/type';
import { useUserInfo } from '@/hook/UserContext';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage'; // canvas 잘라주는 util 함수 필요


interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Mypage() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabData, setTabData] = useState<{ index: number; img: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemList, setItemList] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isTest, setIsTest] = useState<boolean>(false);
  const [num, setNum] = useState<number>(0);
  const { user, setUser } = useUserInfo();
  const [ isOpen, setIsOpen ]= useState<boolean>(false);
  const [ hasImage, setHasImage] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userImg, setUserImg] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const loadMoreItems = useCallback(() => {
    console.log('loadMOreItems');
    setPage((prevPage) => prevPage + 1);
  }, []);

  useEffect(() => {
    console.log("????SDFASDF")
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('📌 감지됨: 하단 요소 보임');
          loadMoreItems(); // 스크롤로 인해 하단 요소가 보이면 다음 페이지 로드
        }
      },
      {
        root: scrollContainerRef.current, // 내부 스크롤 div 지정
        threshold: 1.0,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
      console.log('옵저버 시작', currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreItems, hasMore]);

  useEffect(() => {
    console.log('user:', user);
    console.log('page:', page);
    console.log('hasMore:', hasMore);
  }, [user, page, hasMore]);

  const handleAddImage = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageSrc(result);
        setHasImage(true);
      };

    reader.readAsDataURL(file);
    if (inputRef.current) {
      inputRef.current.value = ''; // 이 줄이 중요!
    }
    }
  };

  useEffect(() => {
    if (hasImage) {
      setIsOpen(true);
      setHasImage(false); // ✅ 반드시 isOpen을 true로 설정한 뒤에 false로 초기화
    }
  }, [hasImage]);

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels || !user?.userId) return;
    const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

    // 이 blob을 FormData에 담아 업로드하면 됨
    const formData = new FormData();
    formData.append('userId', user?.userId);
    formData.append('profile', croppedImageBlob, 'profile.png');
    try {
      const response = await userService.editUserProfile(formData);
      console.log(response)
      setIsOpen(false)
    } catch(error) {
      console.error(error);
    }
  };

  const getUserImg = async() => {
    if(!user) return;
    const param = {
      userId: user?.userId
    }
    try {
      const response = await userService.getUserProfileImg(param);
      // console.log(response.data)
      if (response && response.data) {
        const newImg = response.data.profileImg;
        // 캐시 무효화를 위해 쿼리스트링 추가
        setUserImg(`${newImg}?t=${Date.now()}`);
        console.log(userImg)
      } else {
        setUserImg(null); // 기본 이미지 표시를 위해 null 처리
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if(!isOpen) {
      getUserImg();
    }
  }, [user, isOpen])

  useEffect(() => {
    console.log('WEB BASE URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  }, []);

  return (
    user && (
      <div
        ref={scrollContainerRef}
        className="flex flex-col justify-center items-center w-full max-w-lg pt-10"
      >
        <div className="flex flex-col h-screen w-full">
          <div className="flex flex-col w-full h-full">
            <div className="flex w-full h-[20%]">
              <div className="flex flex-col gap-2 border-2 w-[32%] justify-center items-center">
                <div
                  onClick={handleAddImage}
                  className="flex w-[60%] h-[60%] rounded-full overflow-hidden border-[2px] hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                >
                  {userImg ? (
                    <img
                      key={userImg}
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/profileImg/${userImg}`}
                      className="w-full h-full"
                    />
                  ) : (
                    <img src="/defaultProfile.png" className="w-full h-full" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
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
                      className="w-full h-[200px] border-2 box-border hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                      onClick={() => openModal(item.itemImg)}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/itemImg/${item.itemImg}`}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                  {hasMore && (
                    <div
                      ref={loadMoreRef}
                      className="h-10 bg-transparent col-span-3"
                    />
                  )}
                </div>
              </div>
            </div>

            {isOpen && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className="bg-white rounded-lg shadow-lg w-[60%] p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold mb-4">
                    이미지 크기를 맞춰주세요
                  </h2>
                  <div className="flex justify-center">
                    {imageSrc && (
                      <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden">
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={uploadCroppedImage}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                      업로드
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};
