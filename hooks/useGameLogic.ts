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
 *
 * 價格來源策略：
 * - 鎖定價格（lockRound）：優先用 Chainlink Oracle，fallback 到 Binance WS
 * - 結算價格（settleRound）：優先用 Chainlink Oracle，fallback 到 Binance WS
 *
 * 這讓遊戲結算依賴去中心化 Oracle，而非單一中心化 API。
 */
export function useGameLogic() {
  const phase        = useGameStore((s) => s.phase);
  const prediction   = useGameStore((s) => s.prediction);
  const startRound   = useGameStore((s) => s.startRound);
  const lockRound    = useGameStore((s) => s.lockRound);
  const settleRound  = useGameStore((s) => s.settleRound);

  const currentPrice    = usePriceStore((s) => s.currentPrice);
  const chainlinkPrice  = usePriceStore((s) => s.chainlinkPrice);

  const timerRef         = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceRef         = useRef<number>(0);        // Binance WS 最新價格
  const chainlinkRef     = useRef<number>(0);        // Chainlink 最新價格

  // 保持 ref 同步，避免 stale closure
  useEffect(() => { priceRef.current = currentPrice; },   [currentPrice]);
  useEffect(() => { chainlinkRef.current = chainlinkPrice; }, [chainlinkPrice]);

  /** 取得當前最佳報價：Chainlink 優先，Binance WS 備援 */
  const getBestPrice = useCallback((): number => {
    return chainlinkRef.current > 0 ? chainlinkRef.current : priceRef.current;
  }, []);

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
      // idle → betting：有任一來源的價格後自動開始
      case 'idle':
        if (currentPrice > 0 || chainlinkPrice > 0) {
          timerRef.current = setTimeout(() => startRound(), 500);
        }
        break;

      // betting → locked：倒數結束後以最佳報價鎖定
      case 'betting':
        timerRef.current = setTimeout(() => {
          if (prediction !== null) {
            lockRound(getBestPrice());
          } else {
            startRound(); // 玩家未選擇，跳過此回合
          }
        }, BETTING_DURATION_SEC * 1000);
        break;

      // locked → result：以最佳報價結算
      case 'locked':
        timerRef.current = setTimeout(() => {
          settleRound(getBestPrice());
        }, LOCK_DURATION_SEC * 1000);
        break;

      // result → betting：顯示結果後開下一回合
      case 'result':
        timerRef.current = setTimeout(() => startRound(), RESULT_DISPLAY_SEC * 1000);
        break;
    }

    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return { phase };
}
