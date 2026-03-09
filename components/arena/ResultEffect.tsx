'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { RoundResult } from '@/types';

interface Props {
  result: RoundResult | null;
  visible: boolean;
  onDone: () => void;
}

const CONFIG = {
  win: {
    bg:     'radial-gradient(ellipse at center, #00FF8825 0%, transparent 70%)',
    border: '#00FF88',
    color:  '#00FF88',
    glow:   '#00FF88',
    label:  'WIN',
    sub:    '預測正確！',
    emoji:  '🚀',
  },
  lose: {
    bg:     'radial-gradient(ellipse at center, #FF336625 0%, transparent 70%)',
    border: '#FF3366',
    color:  '#FF3366',
    glow:   '#FF3366',
    label:  'LOSE',
    sub:    '預測失誤，再試一次',
    emoji:  '💥',
  },
  draw: {
    bg:     'radial-gradient(ellipse at center, #00D4FF15 0%, transparent 70%)',
    border: '#00D4FF',
    color:  '#00D4FF',
    glow:   '#00D4FF',
    label:  'DRAW',
    sub:    '價格持平，不計分',
    emoji:  '🤝',
  },
};

export default function ResultEffect({ result, visible, onDone }: Props) {
  if (!result) return null;
  const cfg = CONFIG[result];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDone}
        >
          {/* 全屏背景光暈 */}
          <motion.div
            className="absolute inset-0"
            style={{ background: cfg.bg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6] }}
            transition={{ duration: 0.6 }}
          />

          {/* 中央卡片 */}
          <motion.div
            className="relative flex flex-col items-center gap-5 px-12 py-10 rounded-3xl"
            style={{
              background: '#0A0A0FEE',
              border: `2px solid ${cfg.border}60`,
              boxShadow: `0 0 60px ${cfg.glow}30, inset 0 0 40px ${cfg.glow}08`,
            }}
            initial={{ scale: 0.4, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Emoji */}
            <motion.div
              className="text-6xl"
              initial={{ rotate: -30, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
            >
              {cfg.emoji}
            </motion.div>

            {/* 主標籤 */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-5xl font-black"
              style={{
                fontFamily: 'var(--font-orbitron)',
                color: cfg.color,
                textShadow: `0 0 40px ${cfg.glow}`,
              }}
            >
              {cfg.label}
            </motion.div>

            {/* 副標 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-sm tracking-wider text-center"
            >
              {cfg.sub}
            </motion.p>

            {/* 連勝爆炸特效（win 才有） */}
            {result === 'win' && (
              <motion.div
                className="absolute -top-3 -right-3 text-2xl"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                ⚡
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-600 mt-2 tracking-widest"
            >
              CLICK TO CONTINUE
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
