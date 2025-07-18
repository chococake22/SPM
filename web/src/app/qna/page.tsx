// src/app/qna/page.tsx
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { counterActions } from '@/lib/store/index';
import { RootState } from '@/lib/store/store';
import { useEffect, useState } from 'react';

export default function QnaPage() {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 후 localStorage에서 복원
    dispatch(counterActions.restoreFromStorage());
    setMounted(true);
  }, [dispatch]);

  // 마운트 전까지는 기본값 표시 (서버와 동일)
  if (!mounted) {
    return (
      <div>
        <button>+</button>
        <button>-</button>
        <div>카운터: 0</div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => dispatch(counterActions.increase())}>+</button>
      <button onClick={() => dispatch(counterActions.decrease())}>-</button>
      <div>카운터: {count}</div>
    </div>
  );
}
