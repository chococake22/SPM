'use client';

import { useRouter } from 'next/navigation';
import Button from '../../components/common/Button';
import { useEffect, useRef } from 'react';

const ExpiredPage = () => {
  const router = useRouter();
  const isInitialized = useRef(false);

  const handleLoginPage = () => {
    router.replace('/login'); // push가 아닌 replace를 사용해 히스토리 덮기
  };

  useEffect(() => {
    if (!isInitialized.current) {
      // 세션 만료 페이지의 히스토리를 현재 위치로 덮음 (뒤로가기 시 현재 페이지 유지)
      history.pushState(null, '', location.href);
      isInitialized.current = true;
    }

    const onPopState = () => {
      // 다시 현재 페이지로 replace
      history.pushState(null, '', location.href);
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center ">
      <div>
        <span>세션이 만료되었습니다</span>
      </div>
      <div>
        <Button
          buttonName="로그인 페이지로 이동"
          onClick={handleLoginPage}
        ></Button>
      </div>
    </div>
  );
};

export default ExpiredPage;
