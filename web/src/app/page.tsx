"use client"

import { useEffect, useMemo, useState, useCallback } from 'react';
import ItemBox from '../components/item/ItemBox';
import itemService from '@/services/item.service';
import { ItemListResponse } from '@/types/item/type';
import { flushSync } from 'react-dom';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Mousewheel } from 'swiper/modules';
import useUserInfo2 from '@/hook/useUserInfo';

const ITEMS_PER_PAGE = 3;

const Home = () => {
  const [itemList, setItemList] = useState<ItemListResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const { userInfo, deleteUserInfo } = useUserInfo2();

      useEffect(() => {
        console.log('userInfo - /: ' + userInfo.userId);
      }, [userInfo]);


  // 맨 처음 렌더링이 될 때에는 함수가 실행되지는 않고 정의만 된다.
  const getItems = useCallback(async (pageNumber: number) => {
    try {
      const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
      const response = await itemService.getItems(offset, ITEMS_PER_PAGE);

      // 전체 개수 < 해당 페이지 수
      // 페이지가 더 없음.

      if(!response) {
        return <div>데이터가 없습니다.</div>
      }

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
    console.log('다시 가져옴');
    console.log(itemList);
    // itemList를 가져와서 sorting
    // id는 number 타입이므로 연산을 통해 오름차순으로 정렬함.
    return [...itemList].sort((a, b) => a.id - b.id);
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

  

  return (
    <div className="mt-11 mb-11 flex flex-col space-y-10">
      {sortedItemList.map((entry, index) => (
        <ItemBox
          key={index}
          entry={entry}
        />
      ))}
      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </div>
  );

  /**
   * swiper 기능 적용시 필요함, 현재는 미사용
   */
  // return (
  //   <Swiper
  //     direction="vertical"
  //     slidesPerView={1}
  //     spaceBetween={0}
  //     mousewheel={true}
  //     className="w-full h-screen"
  //     modules={[Mousewheel]}
  //   >
  //     {sortedItemList.map((entry, index) => (
  //       <SwiperSlide key={index}>
  //         <ItemBox entry={entry} />
  //       </SwiperSlide>
  //     ))}
  //     {hasMore && (
  //       <SwiperSlide>
  //         <div
  //           ref={loadMoreRef}
  //           className="w-full h-screen flex items-center justify-center"
  //         >
  //           <p>Loading more...</p>
  //         </div>
  //       </SwiperSlide>
  //     )}
  //   </Swiper>
  // );
};

export default Home;
