"use client"

import { useEffect, useMemo, useState, useCallback } from 'react';
import ItemBox from '@/components/item/ItemBox';
import itemService from '@/services/item.service';
import { ItemListResponse, Item } from '@/types/item/type';
import { flushSync } from 'react-dom';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Mousewheel } from 'swiper/modules';
import { useUserInfo } from '@/hook/UserContext';

const ITEMS_PER_PAGE = 3;

const Home = () => {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { user, setUser } = useUserInfo();
  const [ webUrl, setWebUrl] = useState<string | null>(null);
  const [ apiUrl, setApiUrl] = useState<string | null>(null);
  const [ profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [itemImgUrl, setItemImgUrl] = useState<string | null>(null);

  // 맨 처음 렌더링이 될 때에는 함수가 실행되지는 않고 정의만 된다.
  const getItems = useCallback(async (pageNumber: number) => {
    try {
      const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
      const response = await itemService.getItems(offset, ITEMS_PER_PAGE);
      console.log(response);
      // 전체 개수 < 해당 페이지 수
      // 페이지가 더 없음.

      if (!response?.data) {
        return <div>데이터가 없습니다.</div>;
      }

      // response.data.data.list로 실제 아이템 배열에 접근
      const items = response.data ?? [];
      if (!items) return;

      if (response.data.list.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      flushSync(() => {
        const items = response.data?.list ?? [];
        console.log(items);
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
  }, []);

  // page를 추가해서 데이터를 가져온다.
  // 그 다음의 4개 데이터를 가져옴.
  // page가 변하면 getItems 실행
  // 맨 처음 렌더링이 될 때에는 함수가 실행되지는 않고 정의만 된다.
  const loadMoreItems = useCallback(() => {
    console.log('loadMOreItems');
    setPage((prevPage) => prevPage + 1);
  }, []);

  // 데이터를 가져와서 정렬하기.
const sortedItemList = useMemo(() => {
  if (!Array.isArray(itemList)) return [];

  // itemList를 가져와서 sorting
  // id는 string 타입이므로 parseInt로 숫자로 변환 후 정렬
  return [...itemList].sort((a, b) => parseInt(a.id) - parseInt(b.id));
}, [itemList]);

  // 데이터 요청
  // 처음 렌더링되면 page가 useState로 초기화되니까 바로 된다.
  useEffect(() => {
    console.log('getItems');
    getItems(page); // 컴포넌트가 마운트되면 데이터 요청 실행
  }, [page, getItems]); // 마운트가 된다는 것은 dom에 추가되어 렌더링이 된다는 것

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems(); // 스크롤로 인해 하단 요소가 보이면 다음 페이지 로드
        }
      },
      {
        threshold: 1.0,
      }
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreItems, hasMore]);

  if(!itemList) {
    <div>데이터가 없습니다.</div>
  }
  

  return (
    itemList && (
      <div className="flex flex-col w-full max-w-lg pb-6 pt-4 gap-4 px-4">
        {sortedItemList.map((entry) => (
          console.log(entry),
          <ItemBox
            key={entry.id}
            entry={entry}
          />
        ))}
        {hasMore && <div ref={loadMoreRef} className="h-10" />}
      </div>
    )
  );
};

export default Home;
