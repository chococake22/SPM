"use client"

import { Provider } from "react-redux";
import { UserProvider } from "@/hook/UserContext";
import store from "@/lib/store/store";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <UserProvider>{children}</UserProvider>
    </Provider>
  );
}   