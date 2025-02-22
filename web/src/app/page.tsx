"use client"

import { useEffect, useState } from 'react';
import ItemBox from '../components/Item/ItemBox';
import itemService from '@/services/item.service';
import { ItemListResponse } from '@/types/item/type';

const Home = () => {
  const [list, setList] = useState<ItemListResponse[]>([]);

  const getItems = async () => {
    try {
      const response = await itemService.getItems(null);
      setList(response);
    } catch(error) {
      console.error("Error fetching data:", error)
    }
  }

  // 데이터 요청
  useEffect(() => {
    getItems(); // 컴포넌트가 마운트되면 데이터 요청 실행
  }, []);

  return (
    <div className="mt-10 mb-10">
      {list.map((entry, index) => (
        <ItemBox key={index} entry={entry} />
      ))}
    </div>
  );
};

export default Home;
