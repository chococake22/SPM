import "./global.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import Providers from "@/components/Providers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <NavigationWrapper>{children}</NavigationWrapper>
        </Providers>
      </body>
    </html>
  );
}
