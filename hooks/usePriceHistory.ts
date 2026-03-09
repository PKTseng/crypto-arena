import { usePriceStore } from '@/store/priceStore';

/**
 * 從 priceStore 取出圖表所需資料的 selector hook。
 * 避免在元件內直接解構整個 store 造成不必要的 re-render。
 */
export function usePriceHistory() {
  const priceHistory  = usePriceStore((s) => s.priceHistory);
  const currentPrice  = usePriceStore((s) => s.currentPrice);
  const priceChange24h = usePriceStore((s) => s.priceChange24h);
  const wsStatus      = usePriceStore((s) => s.wsStatus);

  return { priceHistory, currentPrice, priceChange24h, wsStatus };
}
