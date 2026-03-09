import type { FormattedPrice, WinRateInfo } from '@/types';

// ── 價格格式化 ────────────────────────────────────────────────

/** 將數字格式化為千分位 + 小數，並拆分整數/小數部分 */
export function formatPrice(price: number): FormattedPrice {
  const fixed   = price.toFixed(2);
  const [int, dec] = fixed.split('.');
  const integer = Number(int).toLocaleString('en-US');
  return {
    integer,
    decimal: dec ?? '00',
    isPositive: price >= 0,
  };
}

/** 格式化漲跌幅，加上 +/- 符號 */
export function formatChangePercent(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

/** 格式化價差（帶符號） */
export function formatPriceDelta(delta: number): string {
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta.toFixed(2)}`;
}

// ── 勝率計算 ──────────────────────────────────────────────────

export function calcWinRate(wins: number, totalRounds: number): WinRateInfo {
  const winRate = totalRounds === 0 ? 0 : wins / totalRounds;
  return { wins, totalRounds, winRate };
}

/** 將 0~1 的勝率轉為百分比字串 */
export function formatWinRate(winRate: number): string {
  return `${(winRate * 100).toFixed(1)}%`;
}

// ── 時間格式化 ────────────────────────────────────────────────

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

// ── 樣式工具 ──────────────────────────────────────────────────

/** 根據漲跌回傳 Tailwind 顏色 class */
export function getPriceColorClass(value: number): string {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-gray-400';
}

/** 合併 className（簡易版，不需引入 clsx） */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
