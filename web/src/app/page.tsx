"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import ItemBox from '../components/Item/ItemBox';

const Home = () => {
  const [list, setList] = useState([]);

  // 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/items'); // 데이터를 요청하는 엔드포인트
        setList(response.data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // 컴포넌트가 마운트되면 데이터 요청 실행
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
