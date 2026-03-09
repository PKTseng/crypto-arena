'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { RoundRecord } from '@/types';

interface Props {
  history: RoundRecord[];
}

const RESULT_STYLE: Record<string, { color: string; label: string; bg: string }> = {
  win:  { color: '#00FF88', label: 'WIN',  bg: '#00FF8812' },
  lose: { color: '#FF3366', label: 'LOSE', bg: '#FF336612' },
  draw: { color: '#6b7280', label: 'DRAW', bg: '#6b728012' },
};

const DIR_SYMBOL: Record<string, string> = { up: '▲', down: '▼' };

export default function ArenaTradeHistory({ history }: Props) {
  const items = history.slice(0, 5);

  return (
    <div className="flex flex-col gap-3">
      {/* 標頭 */}
      <div
        className="grid grid-cols-5 text-xs tracking-[0.18em] pb-3 border-b border-[#00D4FF]/10"
        style={{ color: '#00D4FF80', fontFamily: 'var(--font-orbitron)' }}
      >
        <span>#</span>
        <span>DIR</span>
        <span>DELTA</span>
        <span>BET</span>
        <span className="text-right">RESULT</span>
      </div>

      {!items.length && (
        <div
          className="text-center py-8 text-xs tracking-widest animate-pulse"
          style={{ color: '#ffffff15', fontFamily: 'var(--font-orbitron)' }}
        >
          NO HISTORY YET
        </div>
      )}

      <AnimatePresence initial={false}>
        {items.map((r) => {
          const rs    = RESULT_STYLE[r.result];
          const delta = r.priceDelta;
          const deltaStr = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}`;
          const dirColor = r.prediction === 'up' ? '#00FF88' : '#FF3366';

          return (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-5 items-center py-3 px-3 rounded-xl text-sm"
              style={{ background: rs.bg, border: `1px solid ${rs.color}15` }}
            >
              {/* 回合 */}
              <span
                className="text-xs"
                style={{ color: '#4b5563', fontFamily: 'var(--font-orbitron)' }}
              >
                #{r.id}
              </span>

              {/* 方向 */}
              <span
                className="font-bold text-base"
                style={{ color: dirColor, fontFamily: 'var(--font-orbitron)' }}
              >
                {DIR_SYMBOL[r.prediction]}
              </span>

              {/* 價差 */}
              <span
                className="font-semibold text-xs"
                style={{
                  color: delta >= 0 ? '#00FF88' : '#FF3366',
                  fontFamily: 'var(--font-orbitron)',
                }}
              >
                {deltaStr}
              </span>

              {/* 下注 */}
              <span
                className="text-xs"
                style={{ color: '#9ca3af', fontFamily: 'var(--font-orbitron)' }}
              >
                ${r.betAmount.toLocaleString()}
              </span>

              {/* 結果 */}
              <span
                className="text-right text-xs font-black tracking-widest"
                style={{ color: rs.color, fontFamily: 'var(--font-orbitron)' }}
              >
                {rs.label}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
