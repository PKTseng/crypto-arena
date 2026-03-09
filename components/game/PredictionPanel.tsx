'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { useGameStore } from '@/store/gameStore';
import { usePriceStore } from '@/store/priceStore';
import { BETTING_DURATION_SEC, LOCK_DURATION_SEC } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { PredictionPanelProps } from '@/types';

export default function PredictionPanel({
  phase,
  onPredict,
  timeLeft,
  totalTime,
}: PredictionPanelProps) {
  const prediction  = useGameStore((s) => s.prediction);
  const lockedPrice = useGameStore((s) => s.lockedPrice);
  const currentPrice = usePriceStore((s) => s.currentPrice);

  const isBetting = phase === 'betting';
  const isLocked  = phase === 'locked';
  const isIdle    = phase === 'idle';

  const { integer, decimal } = formatPrice(currentPrice);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 當前 BTC 價格（大字） */}
      <div className="text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Current Price</p>
        <p className="font-mono font-black text-white">
          <span className="text-4xl">${integer}</span>
          <span className="text-2xl text-gray-500">.{decimal}</span>
        </p>
      </div>

      {/* 倒數計時器 */}
      <AnimatePresence mode="wait">
        {!isIdle && (
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <CountdownTimer timeLeft={timeLeft} totalTime={totalTime} size={88} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 狀態標籤 */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-sm text-center"
        >
          {isIdle    && '等待連線...'}
          {isBetting && (prediction ? `已選擇：${prediction === 'up' ? '▲ 上漲' : '▼ 下跌'}` : '選擇你的預測方向')}
          {isLocked  && `鎖定價格：$${formatPrice(lockedPrice ?? 0).integer}`}
        </motion.p>
      </AnimatePresence>

      {/* UP / DOWN 按鈕 */}
      <div className="flex gap-4 w-full max-w-sm">
        <Button
          variant="up"
          size="lg"
          fullWidth
          disabled={!isBetting || prediction !== null}
          onClick={() => onPredict('up')}
          className={prediction === 'up' ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-950' : ''}
        >
          ▲ UP
        </Button>
        <Button
          variant="down"
          size="lg"
          fullWidth
          disabled={!isBetting || prediction !== null}
          onClick={() => onPredict('down')}
          className={prediction === 'down' ? 'ring-2 ring-red-400 ring-offset-2 ring-offset-gray-950' : ''}
        >
          ▼ DOWN
        </Button>
      </div>

      {/* 鎖定中提示 */}
      {isLocked && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-yellow-400 text-xs text-center animate-pulse"
        >
          ⏳ 等待結算中...
        </motion.p>
      )}
    </div>
  );
}
