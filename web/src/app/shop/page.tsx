"use client"

import {
  useCallback,
  useState,
  MouseEventHandler,
  memo,
  ChangeEvent,
  useEffect,
} from 'react';

interface ChildProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function ShopPage() {

  const [count, setCount] = useState(0);
  const [text, setText] = useState('');  
  
  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    
    setText(e.target.value);
  };

  const handleClick = useCallback(() => {
    console.log('handleClick is created/re-created');
    setCount((prevCount) => prevCount + 1);
  }, [count]);


  // input에 값이 변할 때마다 함수가 새로 생성이 된다.
  // 그러면 메모리를 많이 잡아 먹을 수가 있음.
  // 그래서 useCallback을 이용해서 count가 변할 때만 함수가 새로 생성이 되게끔 한다.

  // const handleClick = () => {
  //   console.log('handleClick is created/re-created');
  //   setCount((prevCount) => prevCount + 1);
  // }

  useEffect(() => {
    console.log("????")
  }, [handleClick])

  return (
    <div>

    </div>
  );
};


export default ShopPage; 

