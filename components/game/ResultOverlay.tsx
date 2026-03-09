'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ResultOverlayProps } from '@/types';
import { formatPriceDelta } from '@/lib/utils';

const resultConfig = {
  win: {
    emoji: '🚀',
    title: 'CORRECT!',
    subtitle: '預測正確，繼續保持！',
    color: 'text-green-400',
    bg:    'from-green-900/60 to-transparent',
    border: 'border-green-700',
  },
  lose: {
    emoji: '💥',
    title: 'WRONG!',
    subtitle: '預測失敗，再接再厲！',
    color: 'text-red-400',
    bg:    'from-red-900/60 to-transparent',
    border: 'border-red-700',
  },
  draw: {
    emoji: '🤝',
    title: 'DRAW',
    subtitle: '價格持平，不計分',
    color: 'text-yellow-400',
    bg:    'from-yellow-900/40 to-transparent',
    border: 'border-yellow-700',
  },
};

export default function ResultOverlay({ result, priceDelta, onClose }: ResultOverlayProps) {
  const config = resultConfig[result];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`relative bg-gradient-to-b ${config.bg} bg-gray-950 border ${config.border} rounded-3xl p-10 text-center max-w-xs w-full mx-4`}
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Emoji */}
          <motion.div
            className="text-6xl mb-4"
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
          >
            {config.emoji}
          </motion.div>

          {/* 標題 */}
          <motion.h2
            className={`text-3xl font-black tracking-widest ${config.color} mb-1`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {config.title}
          </motion.h2>

          {/* 副標題 */}
          <p className="text-gray-400 text-sm mb-6">{config.subtitle}</p>

          {/* 價差 */}
          <div className="bg-gray-800/60 rounded-xl px-4 py-3 mb-6">
            <p className="text-gray-500 text-xs mb-1">價格變動</p>
            <p className={`font-mono font-bold text-xl ${priceDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPriceDelta(priceDelta)} USDT
            </p>
          </div>

          <p className="text-gray-600 text-xs">點擊任意處繼續</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
