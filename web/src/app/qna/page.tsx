// src/app/qna/page.tsx
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { counterActions } from '@/lib/store/index';
import { RootState } from '@/lib/store/store';
import { useEffect, useState } from 'react';

export default function QnaPage() {
  // useDispatch는 액션을 dispatch하는 함수 리턴. react hook으로 사용함.
  // dispatch는 액션을 실행하는 함수임. store에 저장된 액션을 실행하는 함수임.
  const dispatch = useDispatch();
  // RootState 타입의 state를 사용해서 그 안에 있는 counter.value를 가져온다.
  // state의 리턴 타입은 state.getState()의 리턴 타입으로 정의함.
  // export type RootState = ReturnType<typeof store.getState>;
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
    <>
      <div>
        <button onClick={() => dispatch(counterActions.increase())}>+</button>
        <button onClick={() => dispatch(counterActions.decrease())}>-</button>
        <button onClick={() => dispatch(counterActions.setValue(92))}>
          92929
        </button>
        <div>카운터: {count}</div>
      </div>
      <div>
        <button onClick={() => dispatch(counterActions.test("이거가 payload임"))}>테슷흐</button>
      </div>
    </>
  );
}
