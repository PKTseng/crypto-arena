'use client';

import { motion } from 'framer-motion';
import type { CountdownTimerProps } from '@/types';

export default function CountdownTimer({
  timeLeft,
  totalTime,
  size = 80,
}: CountdownTimerProps) {
  const radius      = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress    = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // 顏色隨時間變化：充裕→緊張
  const color =
    progress > 0.5 ? '#22c55e' :
    progress > 0.25 ? '#eab308' :
    '#ef4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 背景圓環 */}
      <svg width={size} height={size} className="absolute rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth={6}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>

      {/* 中心數字 */}
      <motion.span
        key={timeLeft}
        initial={{ scale: 1.2, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative font-mono font-bold text-white"
        style={{ fontSize: size * 0.28 }}
      >
        {timeLeft}
      </motion.span>
    </div>
  );
}
