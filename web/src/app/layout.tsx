import "./global.css";
import { UserProvider } from "@/hook/UserContext";
import NavigationWrapper from "@/components/NavigationWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <UserProvider>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
