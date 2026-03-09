'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}   // 不跟隨系統，用戶自行選擇
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
