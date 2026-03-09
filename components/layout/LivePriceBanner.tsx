'use client';

import PriceTickerBar from '@/components/chart/PriceTickerBar';
import { usePriceStore } from '@/store/priceStore';

export default function LivePriceBanner() {
  const wsStatus = usePriceStore((s) => s.wsStatus);

  // disconnected 時不顯示 Banner，避免誤導
  if (wsStatus === 'disconnected') return null;

  return (
    <div className="w-full border-b border-gray-800 bg-gray-950/60 px-4 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto">
        <PriceTickerBar />
      </div>
    </div>
  );
}
