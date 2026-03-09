'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameLogic } from '@/hooks/useGameLogic';
import PredictionPanel from '@/components/game/PredictionPanel';
import ResultOverlay from '@/components/game/ResultOverlay';
import ScoreBoard from '@/components/game/ScoreBoard';
import RoundHistory from '@/components/game/RoundHistory';
import PriceChart from '@/components/chart/PriceChart';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import { BETTING_DURATION_SEC, LOCK_DURATION_SEC } from '@/lib/constants';

export default function GamePage() {
  useGameLogic(); // 啟動回合狀態機

  const phase        = useGameStore((s) => s.phase);
  const prediction   = useGameStore((s) => s.prediction);
  const roundResult  = useGameStore((s) => s.roundResult);
  const lockedPrice  = useGameStore((s) => s.lockedPrice);
  const score        = useGameStore((s) => s.score);
  const streak       = useGameStore((s) => s.streak);
  const bestStreak   = useGameStore((s) => s.bestStreak);
  const totalRounds  = useGameStore((s) => s.totalRounds);
  const wins         = useGameStore((s) => s.wins);
  const history      = useGameStore((s) => s.history);
  const placePrediction = useGameStore((s) => s.placePrediction);
  const resetGame    = useGameStore((s) => s.resetGame);

  const { priceHistory } = usePriceHistory();

  // 本地倒數計時器
  const totalTime = phase === 'betting' ? BETTING_DURATION_SEC : LOCK_DURATION_SEC;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (phase === 'idle' || phase === 'result') return;
    setTimeLeft(phase === 'betting' ? BETTING_DURATION_SEC : LOCK_DURATION_SEC);

    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // 結果 overlay 顯示控制
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    if (phase === 'result') setShowResult(true);
  }, [phase]);

  const lastRound = history[0];

  return (
    <div className="flex flex-col gap-6">
      {/* 分數板 */}
      <ScoreBoard
        score={score}
        streak={streak}
        bestStreak={bestStreak}
        totalRounds={totalRounds}
        wins={wins}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左欄：圖表 + 預測面板 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
              BTC/USDT 即時走勢
            </p>
            <PriceChart data={priceHistory} height={220} />
          </Card>

          <Card glow={phase === 'betting' ? 'yellow' : phase === 'locked' ? 'green' : 'none'}>
            <PredictionPanel
              phase={phase}
              onPredict={placePrediction}
              timeLeft={timeLeft}
              totalTime={totalTime}
            />
          </Card>
        </div>

        {/* 右欄：回合歷史 */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-semibold">回合歷史</p>
              <Button variant="ghost" size="sm" onClick={resetGame}>
                重置
              </Button>
            </div>
            <RoundHistory history={history} />
          </Card>
        </div>
      </div>

      {/* 結果 Overlay */}
      {showResult && roundResult && lastRound && (
        <ResultOverlay
          result={roundResult}
          priceDelta={lastRound.priceDelta}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
