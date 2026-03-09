import { create } from 'zustand';
import type { PriceState, TradePoint, WebSocketStatus, ChainlinkStatus } from '@/types';
import { CHAINLINK_STALE_THRESHOLD_MS } from '@/lib/constants';

const MAX_HISTORY_LENGTH = 120;

export const usePriceStore = create<PriceState>((set) => ({
  // ── Binance WS ─────────────────────────────────────────────
  currentPrice:  0,
  priceChange24h: 0,
  priceHistory:  [],
  wsStatus:      'connecting',

  // ── Chainlink Oracle ───────────────────────────────────────
  chainlinkPrice:     0,
  chainlinkUpdatedAt: 0,
  chainlinkRoundId:   '',
  chainlinkStatus:    'idle',

  // ── Actions ────────────────────────────────────────────────

  setCurrentPrice: (point: TradePoint) =>
    set((state) => {
      const history = [...state.priceHistory, point];
      if (history.length > MAX_HISTORY_LENGTH) history.shift();
      return { currentPrice: point.price, priceHistory: history };
    }),

  setPriceChange24h: (change: number) =>
    set({ priceChange24h: change }),

  setWsStatus: (status: WebSocketStatus) =>
    set({ wsStatus: status }),

  clearHistory: () =>
    set({ priceHistory: [], currentPrice: 0 }),

  setChainlinkData: (price: number, updatedAt: number, roundId: string) =>
    set({
      chainlinkPrice:     price,
      chainlinkUpdatedAt: updatedAt,
      chainlinkRoundId:   roundId,
      // 自動判斷是否 stale（超過 1 小時未更新）
      chainlinkStatus: Date.now() - updatedAt > CHAINLINK_STALE_THRESHOLD_MS
        ? 'stale'
        : 'success',
    }),

  setChainlinkStatus: (status: ChainlinkStatus) =>
    set({ chainlinkStatus: status }),
}));
