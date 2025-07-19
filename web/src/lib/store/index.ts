// src/lib/store/index.ts
import { createSlice } from '@reduxjs/toolkit';

// 항상 0으로 시작 (서버와 클라이언트 동일)
const initialState = { value: 0 };

// slice는 상태를 관리하는 함수들의 집합이라고 이해함.
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: { 
    // 리듀서 함수 모음집
    // redux toolkit에서 자동으로 액션 생성자를 생성한다.
    // 이거를 counterSlice.actions에 저장함.
    increase: (state) => {
      state.value += 1;
      // 클라이언트에서만 localStorage 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('counter', JSON.stringify(state));
      }
    },
    decrease: (state) => {
      state.value -= 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem('counter', JSON.stringify(state));
      }
    },
    setValue: (state, action) => {
      state.value = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('counter', JSON.stringify(state));
      }
    },
    test: (state, action) => {
      console.log(action)
    },
    // localStorage에서 복원하는 액션
    restoreFromStorage: (state) => {
      // 브라우저 환경에서만 사용하도록 조건문을 추가함.
      if (typeof window !== 'undefined') {
        try {
          // 일단 초기화를 한 다음에 localStorage에서 가져와서 값을 다시 덮어씌우는 형태임.
          const saved = localStorage.getItem('counter');
          if (saved) {
            const parsed = JSON.parse(saved);
            state.value = parsed.value;
          }
        } catch {
          // 에러 시 기본값 유지
        }
      }
    },
  },
});

// counterSlice에서 정의한 액션들을 가져옴.
// redux toolkit에서 자동으로 생성한 액션 생성자 함수들의 객체
// 이 객체를 사용하면 액션을 쉽게 생성할 수 있음.
export const counterActions = counterSlice.actions;
export default counterSlice.reducer;
