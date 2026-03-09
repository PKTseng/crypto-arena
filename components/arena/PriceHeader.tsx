'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePriceHistory } from '@/hooks/usePriceHistory';

export default function PriceHeader() {
  const { currentPrice, priceChange24h, wsStatus } = usePriceHistory();
  const prevRef = useRef(0);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (currentPrice === 0 || prevRef.current === 0) {
      prevRef.current = currentPrice;
      return;
    }
    const dir = currentPrice > prevRef.current ? 'up' : 'down';
    setFlash(dir);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFlash(null), 500);
    prevRef.current = currentPrice;
  }, [currentPrice]);

  const [intPart, decPart] = currentPrice.toFixed(2).split('.');

  const flashColor =
    flash === 'up'   ? '#00FF88' :
    flash === 'down' ? '#FF3366' :
    '#FFFFFF';

  const changeColor = priceChange24h >= 0 ? '#00FF88' : '#FF3366';
  const changeSign  = priceChange24h >= 0 ? '+' : '';

  const statusDot: Record<string, string> = {
    connected:    'bg-[#00FF88]',
    connecting:   'bg-yellow-400 animate-pulse',
    reconnecting: 'bg-orange-400 animate-pulse',
    disconnected: 'bg-[#FF3366]',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#00D4FF]/10">
      {/* 左：主價格 */}
      <div className="flex items-baseline gap-3">
        {/* 幣種標籤 */}
        <span
          className="text-sm font-semibold tracking-[0.2em] text-[#00D4FF] mb-1"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          BTC/USDT
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={Math.round(currentPrice)}
            initial={{ opacity: 0.4, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-baseline gap-1"
          >
            <span
              className="text-5xl sm:text-6xl font-black transition-colors duration-300"
              style={{
                fontFamily: 'var(--font-orbitron)',
                color: flashColor,
                textShadow: flash ? `0 0 30px ${flashColor}80` : 'none',
              }}
            >
              ${Number(intPart).toLocaleString('en-US')}
            </span>
            <span
              className="text-2xl font-bold text-gray-500"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              .{decPart}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 右：24h 漲跌 + 連線狀態 */}
      <div className="flex items-center gap-4">
        <div
          className="flex flex-col items-end px-4 py-2 rounded-xl border"
          style={{
            borderColor: `${changeColor}30`,
            background: `${changeColor}10`,
          }}
        >
          <span className="text-gray-500 text-xs tracking-widest">24H CHANGE</span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-orbitron)', color: changeColor }}
          >
            {changeSign}{priceChange24h.toFixed(2)}%
          </span>
        </div>

        {/* 連線燈號 */}
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusDot[wsStatus]}`} />
          <span className="text-gray-600 text-xs tracking-widest uppercase">{wsStatus}</span>
        </div>
      </div>
    </div>
  );
}
