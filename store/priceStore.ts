import { create } from 'zustand';
import type { PriceState, TradePoint, WebSocketStatus } from '@/types';

const MAX_HISTORY_LENGTH = 120; // 保留最近 120 個資料點（約 2 分鐘）

export const usePriceStore = create<PriceState>((set) => ({
  // ── Initial State ──────────────────────────────────────────
  currentPrice: 0,
  priceChange24h: 0,
  priceHistory: [],
  wsStatus: 'connecting',

  // ── Actions ────────────────────────────────────────────────

  setCurrentPrice: (point: TradePoint) =>
    set((state) => {
      const history = [...state.priceHistory, point];

      // 超過上限時移除最舊的資料點
      if (history.length > MAX_HISTORY_LENGTH) {
        history.shift();
      }

      return {
        currentPrice: point.price,
        priceHistory: history,
      };
    }),

  setPriceChange24h: (change: number) =>
    set({ priceChange24h: change }),

  setWsStatus: (status: WebSocketStatus) =>
    set({ wsStatus: status }),

  clearHistory: () =>
    set({ priceHistory: [], currentPrice: 0 }),
}));
