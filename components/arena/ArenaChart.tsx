'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  ReferenceLine,
  YAxis,
} from 'recharts';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import type { TradePoint } from '@/types';

const CHART_POINTS = 60;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TradePoint }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const { price, timestamp } = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{
        background: 'var(--arena-surface)',
        border: '1px solid #00D4FF40',
        color: '#00D4FF',
        fontFamily: 'var(--font-orbitron)',
      }}
    >
      <div className="font-bold">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      <div className="text-gray-500 mt-0.5">
        {new Date(timestamp).toLocaleTimeString('zh-TW', { hour12: false })}
      </div>
    </div>
  );
}

export default function ArenaChart() {
  const { priceHistory } = usePriceHistory();

  const data = useMemo(
    () => priceHistory.slice(-CHART_POINTS),
    [priceHistory]
  );

  const { yMin, yMax, isUp, basePrice } = useMemo(() => {
    if (data.length < 2) return { yMin: 0, yMax: 1, isUp: true, basePrice: 0 };
    const prices  = data.map((d) => d.price);
    const min     = Math.min(...prices);
    const max     = Math.max(...prices);
    const pad     = (max - min) * 0.3 || 50;
    return {
      yMin:      min - pad,
      yMax:      max + pad,
      isUp:      data[data.length - 1].price >= data[0].price,
      basePrice: data[0].price,
    };
  }, [data]);

  const strokeColor = isUp ? '#00FF88' : '#FF3366';

  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center h-full text-sm tracking-widest text-cyan-400/60 dark:text-[#00D4FF]/30"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        LOADING FEED...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="arenaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={strokeColor} stopOpacity={0.35} />
            <stop offset="60%"  stopColor={strokeColor} stopOpacity={0.08} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0}    />
          </linearGradient>
          {/* 橫向光暈線 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <YAxis domain={[yMin, yMax]} hide />

        {/* 起始基準線 */}
        <ReferenceLine
          y={basePrice}
          stroke="#00D4FF"
          strokeOpacity={0.2}
          strokeDasharray="6 4"
          strokeWidth={1}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2.5}
          fill="url(#arenaGradient)"
          dot={false}
          activeDot={{ r: 5, fill: strokeColor, strokeWidth: 0, filter: 'url(#glow)' }}
          isAnimationActive={false}
          style={{ filter: 'url(#glow)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
