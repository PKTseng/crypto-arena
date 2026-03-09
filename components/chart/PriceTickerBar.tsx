'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import { formatPrice, formatChangePercent, getPriceColorClass } from '@/lib/utils';

export default function PriceTickerBar() {
  const { currentPrice, priceChange24h, wsStatus } = usePriceHistory();
  const prevPriceRef = useRef<number>(0);
  const [flashDir, setFlashDir]   = useState<'up' | 'down' | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (currentPrice === 0) return;
    const prev = prevPriceRef.current;

    if (prev !== 0 && currentPrice !== prev) {
      setFlashDir(currentPrice > prev ? 'up' : 'down');
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlashDir(null), 400);
    }
    prevPriceRef.current = currentPrice;

    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, [currentPrice]);

  const { integer, decimal } = formatPrice(currentPrice);
  const flashColor =
    flashDir === 'up'   ? 'text-green-300' :
    flashDir === 'down' ? 'text-red-300'   :
    'text-white';

  const statusDot: Record<string, string> = {
    connected:    'bg-green-500',
    connecting:   'bg-yellow-500 animate-pulse',
    reconnecting: 'bg-orange-500 animate-pulse',
    disconnected: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-4">
      {/* 連線狀態燈 */}
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${statusDot[wsStatus]}`} />
        <span className="text-gray-500 text-xs hidden sm:block">
          {wsStatus === 'connected' ? 'LIVE' : wsStatus.toUpperCase()}
        </span>
      </div>

      {/* BTC 標籤 */}
      <span className="text-gray-400 text-sm font-semibold tracking-wider">BTC/USDT</span>

      {/* 即時價格（有閃爍動畫） */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPrice}
          initial={{ opacity: 0.5, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`font-mono font-bold transition-colors duration-300 ${flashColor}`}
        >
          <span className="text-2xl">${integer}</span>
          <span className="text-lg text-gray-400">.{decimal}</span>
        </motion.div>
      </AnimatePresence>

      {/* 24h 漲跌幅 */}
      <span className={`text-sm font-semibold ${getPriceColorClass(priceChange24h)}`}>
        {formatChangePercent(priceChange24h)}
      </span>
    </div>
  );
}
