"use client"

import { useEffect, useMemo, useState } from 'react';
import ItemBox from '../components/Item/ItemBox';
import itemService from '@/services/item.service';
import { ItemListResponse } from '@/types/item/type';
import { flushSync } from 'react-dom';

const ITEMS_PER_PAGE = 4;

const Home = () => {
  const [itemList, setItemList] = useState<ItemListResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [check, setCheck] = useState<boolean>(false);

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
          setItemList((prevItems) => [...prevItems, ...response]);
        }
        
        setCheck(true)  
      })
    } catch(error) {
      console.error("Error fetching data:", error)
    }
  }

  const loadMoreItems = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const sortedItemList = useMemo(() => {
    console.log('Re-sorting item list');
    console.log(itemList)
    console.log(check);
    return [...itemList].sort((a, b) => a.itemName.localeCompare(b.itemName));
  }, [itemList])

  // 데이터 요청
  useEffect(() => {
    getItems(page); // 컴포넌트가 마운트되면 데이터 요청 실행
  }, [page]);

  useEffect(() => {
    console.log('Component rendered');
  }, [sortedItemList]);

  return (
    <div className="mt-10 mb-10">
      {sortedItemList.map((entry, index) => (
        <ItemBox key={index} entry={entry} />
      ))}
      <div>페이지 불러오기</div>
    </div>
  );
};

export default Home;
