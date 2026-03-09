import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { usePriceStore } from '@/store/priceStore';
import {
  BETTING_DURATION_SEC,
  LOCK_DURATION_SEC,
  RESULT_DISPLAY_SEC,
} from '@/lib/constants';

/**
 * 遊戲回合計時器與狀態機。
 * 在 /game 頁面的根元件呼叫一次即可。
 */
export function useGameLogic() {
  const phase          = useGameStore((s) => s.phase);
  const prediction     = useGameStore((s) => s.prediction);
  const startRound     = useGameStore((s) => s.startRound);
  const lockRound      = useGameStore((s) => s.lockRound);
  const settleRound    = useGameStore((s) => s.settleRound);
  const currentPrice   = usePriceStore((s) => s.currentPrice);

  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceRef       = useRef<number>(0);

  // 讓 timer callback 能拿到最新 price，而不是 stale closure
  useEffect(() => {
    priceRef.current = currentPrice;
  }, [currentPrice]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── 狀態機 ────────────────────────────────────────────────
  useEffect(() => {
    clearTimer();

    switch (phase) {
      // idle → betting：有價格後自動開始第一回合
      case 'idle':
        if (currentPrice > 0) {
          timerRef.current = setTimeout(() => {
            startRound();
          }, 500);
        }
        break;

      // betting → locked：倒數結束後鎖定（若無預測則跳過，直接開下一回合）
      case 'betting':
        timerRef.current = setTimeout(() => {
          if (prediction !== null) {
            lockRound(priceRef.current);
          } else {
            // 玩家未選擇，跳過此回合直接重新開始
            startRound();
          }
        }, BETTING_DURATION_SEC * 1000);
        break;

      // locked → result：等待結算
      case 'locked':
        timerRef.current = setTimeout(() => {
          settleRound(priceRef.current);
        }, LOCK_DURATION_SEC * 1000);
        break;

      // result → betting：顯示結果後開下一回合
      case 'result':
        timerRef.current = setTimeout(() => {
          startRound();
        }, RESULT_DISPLAY_SEC * 1000);
        break;
    }

    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return { phase };
}
