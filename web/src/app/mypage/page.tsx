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
import Link from 'next/link';
import { getUserIdFromUsername } from '@/lib/userUtils';
import Image from 'next/image';


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
  const [num, setNum] = useState<number>(0);
  const { user, setUser } = useUserInfo();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userImg, setUserImg] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  // 변경: 스크롤 컨테이너 Ref의 이름을 명확하게 변경했습니다.
  const itemGridScrollContainerRef = useRef<HTMLDivElement>(null);
  const [userIdForLink, setUserIdForLink] = useState<string>('');

  const openModal = (img: string) => {
    setSelectedImage(img);
  };

  const tabs = [
    { label: '내 사진', content: 'tab1' },
    { label: '랜덤보기', content: 'tab2' },
    { label: '제목 없음', content: 'tab3' },
  ];

  // 페이지당 사진 개수
  const ITEMS_PER_PAGE = 12;

  /**
   * useCallback을 사용하고 두 번째 인자로 빈 배열을 넣음
   * 그럴 경우 컴포넌트가 처음 렌더링이 될 때 한 번만 함수를 만들고 이후에는 그걸 재사용함
   * 그래서 isTest는 맨 처음에 선언된 false이고, user도 처음엔 값이 없기 때문에 null이 되는 것임.
   */
  const getUserItems = useCallback(
    async (pageNumber: number) => {
      if (!user) {
        return;
      }

      try {
        const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
        const response = await itemService.getUserItems(
          user.userId,
          offset,
          ITEMS_PER_PAGE
        );

        if (!response?.data) {
          return <div>없습니다</div>;
        }

        if (response.data.list.length < ITEMS_PER_PAGE) {
          // 전체 개수 < 해당 페이지 수
          // 페이지가 더 없음.
          setHasMore(false);
        }

        flushSync(() => {
          const items = response.data?.list ?? [];
          if (!items) return; // undefined일 경우 아무 작업도 하지 않음

          if (pageNumber === 1) {
            setItemList(items);
          } else {
            setItemList((prevItems) => [...prevItems, ...items]);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    [user]
  );

  const sortedItemList = useMemo(() => {
    if (itemList && Array.isArray(itemList)) {
      // itemList를 가져와서 sorting
      // id는 string 타입이므로 parseInt로 숫자로 변환 후 정렬
      return [...itemList].sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }
    return []; // 빈 배열 반환 추가
  }, [itemList]);

  // 데이터 요청
  // 처음 렌더링되면 page가 useState로 초기화되니까 바로 된다.
  useEffect(() => {
    console.log('useEffect - getUserItems');
    if (user) {
      getUserItems(page); // 컴포넌트가 마운트되면 데이터 요청 실행
    }
  }, [getUserItems, page, user]); // 마운트가 된다는 것은 dom에 추가되어 렌더링이 된다는 것

  const handleAddImage = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

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
      console.log(response);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserImg = useCallback(async () => {
    if (!user) return;
    const param = {
      userId: user?.userId,
    };
    try {
      const response = await userService.getUserProfileImg(param);
      if (response && response.data) {
        const newImg = response.data.profileImg;
        // 캐시 무효화를 위해 쿼리스트링 추가
        setUserImg(`${newImg}?t=${Date.now()}`);
        console.log(userImg);
      } else {
        setUserImg(null); // 기본 이미지 표시를 위해 null 처리
      }
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen) {
      getUserImg();
    }
  }, [user, isOpen, getUserImg]);

  // observer로 해결 못함
  // 스크롤 감지로 대체
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight
      ) {
        console.log('window scroll near bottom: ' + page);
        setPage(page + 1)
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  // 사용자 ID를 가져오는 함수
  const fetchUserId = useCallback(async () => {
    if (!user?.username) return;
    try {
      const actualUserId = await getUserIdFromUsername(user.username);
      setUserIdForLink(actualUserId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
      setUserIdForLink(user.username); // fallback
    }
  }, [user?.username]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  return (
    user && (
      <div className="flex flex-col w-full max-w-lg pb-12 px-4">
        <div className="flex w-full h-[20%]">
          <div className="flex flex-col gap-2 border-2 w-[32%] justify-center items-center">
            <div
              onClick={handleAddImage}
              className="flex w-[60%] h-[60%] rounded-full overflow-hidden border-[2px] hover:border-blue-500 transition-colors duration-200 cursor-pointer"
            >
              {userImg ? (
                <Image
                  key={userImg}
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/profileImg/${userImg}`}
                  alt={`Profile of ${user?.username}`}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src="/defaultProfile.png"
                  alt="Default profile"
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
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
          <div
            className="flex flex-col w-full overflow-y-auto"
            ref={itemGridScrollContainerRef}
          >
            <div className="grid grid-cols-3">
              {sortedItemList?.map((item, index) => (
                <div
                  key={index}
                  className="w-full h-[200px] border-2 box-border hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                  onClick={() => openModal(item.itemImg)}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/itemImg/${item.itemImg}`}
                    alt={`Item ${item.id}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* 감지용 DIV */}
              {hasMore && <div ref={loadMoreRef} className="h-10"></div>}
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
    )
  );
};
