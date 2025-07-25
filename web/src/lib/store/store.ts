import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./index";

// 서버에서는 기본 상태, 클라이언트에서는 localStorage에서 복원
const createStore = () => {
  // store를 생성함.
  return configureStore({
    reducer: { counter: counterSlice.reducer },
    // getDefaultMiddleware : 기본적으로 제공하는 미들웨어.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// 서버에서는 기본 store, 클라이언트에서는 동적으로 생성
let store: ReturnType<typeof createStore> | undefined;

if (typeof window === 'undefined') {
  // 서버에서는 기본 store 
  store = createStore();
} else {
  // 클라이언트에서는 동적으로 생성
  if (!store) {
    store = createStore();
  }
}

export default store!;
export type RootState = ReturnType<typeof store.getState>;  // => () => RootState