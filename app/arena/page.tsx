'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useChainlinkPrice } from '@/hooks/useChainlinkPrice';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import { BETTING_DURATION_SEC, LOCK_DURATION_SEC } from '@/lib/constants';
import PriceHeader from '@/components/arena/PriceHeader';
import ArenaChart from '@/components/arena/ArenaChart';
import ArenaPredictionPanel from '@/components/arena/ArenaPredictionPanel';
import ArenaTradeHistory from '@/components/arena/ArenaTradeHistory';
import ResultEffect from '@/components/arena/ResultEffect';

// ── 面板共用 class（light/dark 雙主題）────────────────────────
const PANEL_CLS = 'bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#00D4FF]/[0.08] rounded-[1.25rem]';

export default function ArenaPage() {
  useGameLogic();      // 啟動遊戲狀態機
  useChainlinkPrice(); // 定期讀取 Chainlink BTC/USD Oracle

  const phase        = useGameStore((s) => s.phase);
  const roundResult  = useGameStore((s) => s.roundResult);
  const history      = useGameStore((s) => s.history);
  const score        = useGameStore((s) => s.score);
  const streak       = useGameStore((s) => s.streak);
  const bestStreak   = useGameStore((s) => s.bestStreak);
  const wins         = useGameStore((s) => s.wins);
  const totalRounds  = useGameStore((s) => s.totalRounds);
  const placePrediction = useGameStore((s) => s.placePrediction);
  const resetGame    = useGameStore((s) => s.resetGame);

  // 本地倒數計時器
  const totalTime    = phase === 'betting' ? BETTING_DURATION_SEC : LOCK_DURATION_SEC;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (phase === 'idle' || phase === 'result') return;
    setTimeLeft(phase === 'betting' ? BETTING_DURATION_SEC : LOCK_DURATION_SEC);
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // ── 結果 Overlay ──────────────────────────────────────────
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    if (phase === 'result') setShowResult(true);
  }, [phase]);

  // ── 震動動畫（lose 時） ────────────────────────────────────
  const [scope, animate] = useAnimate();
  const prevPhase = useRef(phase);

  useEffect(() => {
    if (prevPhase.current !== 'result' && phase === 'result' && roundResult === 'lose') {
      animate(scope.current, {
        x: [0, -14, 14, -10, 10, -6, 6, -3, 3, 0],
      }, { duration: 0.55, ease: 'easeOut' });
    }
    prevPhase.current = phase;
  }, [phase, roundResult, animate, scope]);

  // ── 勝率計算 ──────────────────────────────────────────────
  const winRate = totalRounds > 0 ? ((wins / totalRounds) * 100).toFixed(1) : '—';

  const handlePredict = useCallback(
    (dir: 'up' | 'down') => placePrediction(dir),
    [placePrediction]
  );

  return (
    <>
      <motion.div ref={scope} className="flex flex-col gap-6">

        {/* ── 頂部：BTC 即時價格 ── */}
        <PriceHeader />

        {/* ── 統計列 ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'SCORE',      value: score.toLocaleString(), color: '#00D4FF' },
            { label: 'STREAK 🔥',  value: streak,                 color: '#FFB800' },
            { label: 'BEST',       value: bestStreak,             color: '#9b59b6' },
            { label: 'WIN RATE',   value: `${winRate}%`,          color: '#00FF88' },
          ].map(({ label, value, color }) => (
            <motion.div
              key={label}
              className="flex flex-col items-center py-3 px-2 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-white/5"
              layout
            >
              <span
                className="text-[10px] tracking-[0.2em] text-gray-600 mb-1"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {label}
              </span>
              <motion.span
                key={String(value)}
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-black"
                style={{ fontFamily: 'var(--font-orbitron)', color }}
              >
                {value}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* ── 中間：圖表 + 預測面板 ── */}
        <div className="grid lg:grid-cols-5 gap-4">

          {/* 左：走勢圖（佔 3 欄） */}
          <div className={`lg:col-span-3 p-5 ${PANEL_CLS}`}>
            <div
              className="text-xs tracking-[0.2em] mb-4"
              style={{ color: '#00D4FF60', fontFamily: 'var(--font-orbitron)' }}
            >
              LIVE FEED — LAST 60 TRADES
            </div>
            <div style={{ height: 260 }}>
              <ArenaChart />
            </div>
          </div>

          {/* 右：預測面板（佔 2 欄） */}
          <div
            className={`lg:col-span-2 p-6 ${PANEL_CLS}`}
            style={{
              boxShadow: phase === 'betting'
                ? '0 0 40px #00D4FF10'
                : phase === 'locked'
                ? '0 0 40px #FFB80010'
                : 'none',
            }}
          >
            <ArenaPredictionPanel
              phase={phase}
              onPredict={handlePredict}
              timeLeft={timeLeft}
            />
          </div>
        </div>

        {/* ── 底部：交易歷史 ── */}
        <div className={`p-6 ${PANEL_CLS}`}>
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs tracking-[0.2em]"
              style={{ color: '#00D4FF60', fontFamily: 'var(--font-orbitron)' }}
            >
              RECENT TRADES
            </span>
            <button
              onClick={resetGame}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-500"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              RESET
            </button>
          </div>
          <ArenaTradeHistory history={history} />
        </div>

      </motion.div>

      {/* ── 結果特效 ── */}
      <ResultEffect
        result={roundResult}
        visible={showResult}
        onDone={() => setShowResult(false)}
      />
    </>
  );
}
