'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useMemo } from 'react';
import type { PriceChartProps, TradePoint } from '@/types';

// ── 工具函式 ──────────────────────────────────────────────────

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ── 自訂 Tooltip ──────────────────────────────────────────────

interface TooltipPayload {
  value: number;
  payload: TradePoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const { price, timestamp } = payload[0].payload;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-yellow-400 font-mono font-semibold">
        ${formatPrice(price)}
      </p>
      <p className="text-gray-400 text-xs mt-0.5">{formatTime(timestamp)}</p>
    </div>
  );
}

// ── 主元件 ────────────────────────────────────────────────────

export default function PriceChart({ data, height = 200 }: PriceChartProps) {
  // 計算漲跌（首尾比較）決定圖表顏色
  const trend = useMemo(() => {
    if (data.length < 2) return 'neutral';
    const first = data[0].price;
    const last  = data[data.length - 1].price;
    if (last > first) return 'up';
    if (last < first) return 'down';
    return 'neutral';
  }, [data]);

  // Y 軸範圍：留一點 padding 讓線不貼邊
  const { yMin, yMax } = useMemo(() => {
    if (!data.length) return { yMin: 0, yMax: 1 };
    const prices = data.map((d) => d.price);
    const min    = Math.min(...prices);
    const max    = Math.max(...prices);
    const padding = (max - min) * 0.2 || 1;
    return { yMin: min - padding, yMax: max + padding };
  }, [data]);

  // 起始價格，用於 ReferenceLine
  const basePrice = data[0]?.price ?? null;

  const colorMap = {
    up:      { stroke: '#22c55e', fill: '#22c55e' }, // green-500
    down:    { stroke: '#ef4444', fill: '#ef4444' }, // red-500
    neutral: { stroke: '#eab308', fill: '#eab308' }, // yellow-500
  };
  const { stroke, fill } = colorMap[trend];
  const gradientId = `priceGradient-${trend}`;

  if (!data.length) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-gray-500 text-sm"
      >
        等待價格資料中...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={fill} stopOpacity={0.25} />
            <stop offset="95%" stopColor={fill} stopOpacity={0}    />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          minTickGap={60}
        />

        <YAxis
          domain={[yMin, yMax]}
          tickFormatter={(v: number) => `$${v.toLocaleString()}`}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={72}
          orientation="right"
        />

        {/* 起始價格基準線 */}
        {basePrice !== null && (
          <ReferenceLine
            y={basePrice}
            stroke="#4b5563"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
        )}

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="price"
          stroke={stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: stroke, strokeWidth: 0 }}
          isAnimationActive={false} // 關閉動畫，即時資料不需補間
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
