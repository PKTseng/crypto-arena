import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import LivePriceBanner from '@/components/layout/LivePriceBanner';
import WSProvider from './WSProvider';
import WalletProvider from '@/providers/WalletProvider';
import ThemeProvider from '@/providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: 'CryptoArena — BTC 漲跌預測遊戲',
  description: '即時 BTC 價格預測競技平台，考驗你的市場直覺',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning：next-themes 在 client 端注入 class，避免 hydration warning
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable} ${orbitron.variable}
          bg-slate-50 text-slate-900
          dark:bg-gray-950 dark:text-white
          antialiased min-h-screen
          transition-colors duration-200
        `}
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <ThemeProvider>
          <WalletProvider>
            <WSProvider>
              <Navbar />
              <LivePriceBanner />
              <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {children}
              </main>
            </WSProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
