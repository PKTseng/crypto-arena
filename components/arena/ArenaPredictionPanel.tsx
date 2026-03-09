'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import type { GamePhase, PredictionDirection } from '@/types';
import { BETTING_DURATION_SEC, LOCK_DURATION_SEC } from '@/lib/constants';

// ── SVG 倒數圓環 ──────────────────────────────────────────────
const RADIUS      = 52;
const STROKE_W    = 5;
const SIZE        = (RADIUS + STROKE_W) * 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CountdownRing({
  timeLeft,
  totalTime,
}: {
  timeLeft: number;
  totalTime: number;
}) {
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const offset   = CIRCUMFERENCE * (1 - progress);
  const color    =
    progress > 0.5 ? '#00D4FF' :
    progress > 0.25 ? '#FFB800' :
    '#FF3366';

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="absolute -rotate-90">
        {/* 背景環 */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none" stroke="#ffffff08" strokeWidth={STROKE_W}
        />
        {/* 進度環 */}
        <motion.circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>

      {/* 中心文字 */}
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-black text-4xl text-white"
            style={{ fontFamily: 'var(--font-orbitron)', color }}
          >
            {timeLeft}
          </motion.span>
        </AnimatePresence>
        <span className="text-gray-600 text-[10px] tracking-widest mt-0.5">SEC</span>
      </div>
    </div>
  );
}

// ── 下注金額預設值 ────────────────────────────────────────────
const BET_PRESETS = [10, 50, 100, 500];

// ── 主元件 ────────────────────────────────────────────────────
interface Props {
  phase: GamePhase;
  onPredict: (dir: PredictionDirection) => void;
  timeLeft: number;
}

export default function ArenaPredictionPanel({ phase, onPredict, timeLeft }: Props) {
  const prediction  = useGameStore((s) => s.prediction);
  const betAmount   = useGameStore((s) => s.betAmount);
  const setBetAmount = useGameStore((s) => s.setBetAmount);
  const lockedPrice = useGameStore((s) => s.lockedPrice);

  const isBetting = phase === 'betting';
  const isLocked  = phase === 'locked';
  const totalTime = isBetting ? BETTING_DURATION_SEC : LOCK_DURATION_SEC;

  const canPredict = isBetting && prediction === null;

  return (
    <div className="flex flex-col items-center gap-6 h-full">

      {/* 倒數圓環 */}
      <div className="flex flex-col items-center gap-2">
        {phase !== 'idle' ? (
          <CountdownRing timeLeft={timeLeft} totalTime={totalTime} />
        ) : (
          <div
            className="text-sm tracking-[0.25em] animate-pulse"
            style={{ color: '#00D4FF', fontFamily: 'var(--font-orbitron)' }}
          >
            CONNECTING...
          </div>
        )}

        {/* 階段標籤 */}
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs tracking-[0.2em] uppercase"
            style={{
              color: isBetting ? '#00D4FF' : isLocked ? '#FFB800' : '#6b7280',
              fontFamily: 'var(--font-orbitron)',
            }}
          >
            {isBetting
              ? prediction ? `LOCKED: ${prediction === 'up' ? '▲ UP' : '▼ DOWN'}` : 'PLACE YOUR BET'
              : isLocked
              ? `LOCKED @ $${lockedPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : 'WAITING'}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* UP / DOWN 按鈕 */}
      <div className="flex gap-3 w-full">
        {/* UP */}
        <motion.button
          onClick={() => canPredict && onPredict('up')}
          disabled={!canPredict}
          whileHover={canPredict ? { scale: 1.04, y: -2 } : {}}
          whileTap={canPredict ? { scale: 0.96 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5 rounded-2xl font-black text-lg transition-all duration-200 select-none"
          style={{
            fontFamily: 'var(--font-orbitron)',
            background: prediction === 'up'
              ? '#00FF8822'
              : canPredict ? '#00FF8812' : '#00FF8806',
            border: `2px solid ${prediction === 'up' ? '#00FF88' : canPredict ? '#00FF8840' : '#00FF8815'}`,
            color: prediction === 'up' ? '#00FF88' : canPredict ? '#00FF88CC' : '#00FF8840',
            boxShadow: prediction === 'up' ? '0 0 30px #00FF8830' : 'none',
            cursor: canPredict ? 'pointer' : 'not-allowed',
          }}
        >
          <span className="text-2xl">▲</span>
          <span>UP</span>
        </motion.button>

        {/* DOWN */}
        <motion.button
          onClick={() => canPredict && onPredict('down')}
          disabled={!canPredict}
          whileHover={canPredict ? { scale: 1.04, y: 2 } : {}}
          whileTap={canPredict ? { scale: 0.96 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5 rounded-2xl font-black text-lg transition-all duration-200 select-none"
          style={{
            fontFamily: 'var(--font-orbitron)',
            background: prediction === 'down'
              ? '#FF336622'
              : canPredict ? '#FF336612' : '#FF336606',
            border: `2px solid ${prediction === 'down' ? '#FF3366' : canPredict ? '#FF336640' : '#FF336615'}`,
            color: prediction === 'down' ? '#FF3366' : canPredict ? '#FF3366CC' : '#FF336640',
            boxShadow: prediction === 'down' ? '0 0 30px #FF336630' : 'none',
            cursor: canPredict ? 'pointer' : 'not-allowed',
          }}
        >
          <span className="text-2xl">▼</span>
          <span>DOWN</span>
        </motion.button>
      </div>

      {/* 下注金額 */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs tracking-[0.2em] text-gray-500"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            BET AMOUNT
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: '#00D4FF', fontFamily: 'var(--font-orbitron)' }}
          >
            ${betAmount.toLocaleString()}
          </span>
        </div>

        {/* 快捷按鈕 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {BET_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => isBetting && setBetAmount(preset)}
              disabled={!isBetting}
              className="py-2 rounded-lg text-xs font-semibold transition-all duration-150"
              style={{
                fontFamily: 'var(--font-orbitron)',
                background: betAmount === preset ? '#00D4FF20' : '#ffffff08',
                border: `1px solid ${betAmount === preset ? '#00D4FF60' : '#ffffff10'}`,
                color: betAmount === preset ? '#00D4FF' : '#6b7280',
                cursor: isBetting ? 'pointer' : 'not-allowed',
              }}
            >
              ${preset}
            </button>
          ))}
        </div>

        {/* 自訂輸入 */}
        <input
          type="number"
          min={1}
          max={100000}
          value={betAmount}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v > 0) setBetAmount(v);
          }}
          disabled={!isBetting}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-center font-semibold outline-none transition-all"
          style={{
            fontFamily: 'var(--font-orbitron)',
            background: '#ffffff06',
            border: '1px solid #00D4FF20',
            color: isBetting ? '#ffffff' : '#4b5563',
            cursor: isBetting ? 'text' : 'not-allowed',
          }}
        />
      </div>
    </div>
  );
}
