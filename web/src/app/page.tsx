"use client"

import { useEffect, useMemo, useState } from 'react';
import ItemBox from '../components/Item/ItemBox';
import itemService from '@/services/item.service';
import { ItemListResponse } from '@/types/item/type';
import { flushSync } from 'react-dom';
import { useRef } from 'react';



const ITEMS_PER_PAGE = 3;

const Home = () => {
  const [itemList, setItemList] = useState<ItemListResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const getItems = async (pageNumber: number) => {
    try {
      const offset = (pageNumber - 1) * ITEMS_PER_PAGE;
      const response = await itemService.getItems(offset, ITEMS_PER_PAGE);

      // 전체 개수 < 해당 페이지 수
      // 페이지가 더 없음.
      if (response.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      flushSync(() => {
        if(pageNumber === 1) {
          setItemList(response);
        } else {
          // 기존꺼에 새로운 가져온 데이터를 추가해서 배열을 만들었음.
          setItemList((prevItems) => [...prevItems, ...response]);
        }
      })
    } catch(error) {
      console.error("Error fetching data:", error)
    }
  }

  // page를 추가해서 데이터를 가져온다.
  // 그 다음의 4개 데이터를 가져옴.
  // page가 변하면 getItems 실행
  const loadMoreItems = () => {
    setPage((prevPage) => prevPage + 1)
  }

  // 데이터를 가져와서 정렬하기.
  const sortedItemList = useMemo(() => {
    console.log('Re-sorting item list');
    // itemList를 가져와서 sorting
    return [...itemList].sort((a, b) => a.itemName.localeCompare(b.itemName));
  }, [itemList]);

  

  // 데이터 요청
  useEffect(() => {
    getItems(page); // 컴포넌트가 마운트되면 데이터 요청 실행
  }, [page]);       // 마운트가 된다는 것은 dom에 추가되어 렌더링이 된다는 것

  useEffect(() => {
    console.log('Component rendered');
  }, [sortedItemList]);

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

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, hasMore]);


  return (
    <div className="mt-10 mb-10">
      {sortedItemList.map((entry, index) => (
        <ItemBox key={index} entry={entry} />
      ))}
      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </div>
  );
};

export default Home;
