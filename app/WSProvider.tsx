'use client';

import { useBinanceWS } from '@/hooks/useBinanceWS';

/**
 * WebSocket 初始化用的 Client Component wrapper。
 * 放在 layout.tsx（Server Component）中，讓 WS 連線在整個 App 生命週期只建立一次。
 */
export default function WSProvider({ children }: { children: React.ReactNode }) {
  useBinanceWS();
  return <>{children}</>;
}
