// src/lib/store/index.ts
import { createSlice } from '@reduxjs/toolkit';

// 항상 0으로 시작 (서버와 클라이언트 동일)
const initialState = { value: 0 };

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
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
    // localStorage에서 복원하는 액션
    restoreFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        try {
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

export const counterActions = counterSlice.actions;
export default counterSlice.reducer;
