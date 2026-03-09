'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePriceHistory } from '@/hooks/usePriceHistory'
import { usePriceStore } from '@/store/priceStore'
import { CHAINLINK_BTC_USD_ADDRESS } from '@/lib/constants'

// ── 工具函式 ──────────────────────────────────────────────────
function timeSince(ms: number): string {
  if (!ms) return '—'
  const sec = Math.floor((Date.now() - ms) / 1000)
  if (sec < 60) return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return `${Math.floor(sec / 3600)}h ago`
}

// ── Chainlink Oracle Badge ────────────────────────────────────
function ChainlinkBadge() {
  const chainlinkPrice = usePriceStore((s) => s.chainlinkPrice)
  const chainlinkUpdatedAt = usePriceStore((s) => s.chainlinkUpdatedAt)
  const chainlinkStatus = usePriceStore((s) => s.chainlinkStatus)
  const chainlinkRoundId = usePriceStore((s) => s.chainlinkRoundId)

  // 每 10s 更新 "N ago" 文字
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10_000)
    return () => clearInterval(id)
  }, [])

  const statusConfig: Record<string, { dot: string; label: string; glow: string }> = {
    idle: { dot: '#4b5563', label: 'IDLE', glow: 'none' },
    loading: { dot: '#FFB800', label: 'LOADING…', glow: '0 0 8px #FFB80060' },
    success: { dot: '#00FF88', label: 'LIVE', glow: '0 0 8px #00FF8860' },
    stale: { dot: '#FF8C00', label: 'STALE', glow: '0 0 8px #FF8C0060' },
    error: { dot: '#FF3366', label: 'ERROR', glow: '0 0 8px #FF336660' }
  }
  const cfg = statusConfig[chainlinkStatus] ?? statusConfig.idle

  // 用正確的 checksum 地址產生 Etherscan 連結
  const etherscanUrl = `https://etherscan.io/address/0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c`

  return (
    <a
      href={etherscanUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-1.5 px-4 py-3 rounded-xl transition-colors"
      style={{
        background: '#00D4FF08',
        border: '1px solid #00D4FF20',
        textDecoration: 'none',
        minWidth: 160
      }}
      title="View Chainlink BTC/USD feed on Etherscan"
    >
      {/* 標頭 */}
      <div className="flex items-center gap-2">
        {/* Chainlink 六角形 logo 替代：用文字 */}
        <span className="text-[10px] font-bold tracking-[0.18em] text-[#375BD2]">⬡ CHAINLINK</span>
        <span className="text-[10px] text-gray-600 tracking-widest">ORACLE</span>
        <span className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: cfg.dot, boxShadow: cfg.glow }} />
        <span className="text-[9px] font-bold tracking-widest" style={{ color: cfg.dot }}>
          {cfg.label}
        </span>
      </div>

      {/* 價格 */}
      <div className="flex items-baseline gap-1.5">
        {chainlinkStatus === 'loading' ? (
          <span
            className="text-lg font-black animate-pulse"
            style={{ color: '#4b5563', fontFamily: 'var(--font-orbitron)' }}
          >
            ——,———
          </span>
        ) : chainlinkPrice > 0 ? (
          <AnimatePresence mode="wait">
            <motion.span
              key={Math.round(chainlinkPrice)}
              initial={{ opacity: 0.5, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-black text-slate-900 dark:text-white"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              ${chainlinkPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="text-lg font-black text-gray-600" style={{ fontFamily: 'var(--font-orbitron)' }}>
            N/A
          </span>
        )}
      </div>

      {/* 更新時間 + Round ID */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-600">Updated {timeSince(chainlinkUpdatedAt)}</span>
        {chainlinkRoundId && <span className="text-[9px] text-gray-700 font-mono">#{chainlinkRoundId.slice(-6)}</span>}
      </div>
    </a>
  )
}

// ── 主元件 ────────────────────────────────────────────────────
export default function PriceHeader() {
  const { currentPrice, priceChange24h, wsStatus } = usePriceHistory()
  const prevRef = useRef(0)
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (currentPrice === 0 || prevRef.current === 0) {
      prevRef.current = currentPrice
      return
    }
    const dir = currentPrice > prevRef.current ? 'up' : 'down'
    setFlash(dir)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setFlash(null), 500)
    prevRef.current = currentPrice
  }, [currentPrice])

  const [intPart, decPart] = currentPrice.toFixed(2).split('.')

  const flashColor = flash === 'up' ? '#00FF88' : flash === 'down' ? '#FF3366' : null

  const changeColor = priceChange24h >= 0 ? '#00FF88' : '#FF3366'
  const changeSign = priceChange24h >= 0 ? '+' : ''

  const statusDot: Record<string, string> = {
    connected: 'bg-[#00FF88]',
    connecting: 'bg-yellow-400 animate-pulse',
    reconnecting: 'bg-orange-400 animate-pulse',
    disconnected: 'bg-[#FF3366]'
  }

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-[#00D4FF]/10">
      {/* 上排：Binance 即時價格 + 24h 變化 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {/* 左：主價格 */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-sm font-semibold tracking-[0.2em] text-[#00D4FF] mb-1"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            BTC/USDT
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={Math.round(currentPrice)}
              initial={{ opacity: 0.4, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-baseline gap-1"
            >
              <span
                className="text-5xl sm:text-6xl font-black transition-colors duration-300 text-slate-900 dark:text-white"
                style={{
                  fontFamily: 'var(--font-orbitron)',
                  color: flashColor ?? undefined,
                  textShadow: flashColor ? `0 0 30px ${flashColor}80` : 'none'
                }}
              >
                ${Number(intPart).toLocaleString('en-US')}
              </span>
              <span className="text-2xl font-bold text-gray-500" style={{ fontFamily: 'var(--font-orbitron)' }}>
                .{decPart}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 右：24h + 連線狀態 */}
        <div className="flex items-center gap-4">
          <div
            className="flex flex-col items-end px-4 py-2 rounded-xl border"
            style={{
              borderColor: `${changeColor}30`,
              background: `${changeColor}10`
            }}
          >
            <span className="text-gray-500 text-xs tracking-widest">24H CHANGE</span>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-orbitron)', color: changeColor }}>
              {changeSign}
              {priceChange24h.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${statusDot[wsStatus]}`} />
            <span className="text-gray-600 text-xs tracking-widest uppercase">{wsStatus}</span>
          </div>
        </div>
      </div>

      {/* 下排：Chainlink Oracle Badge */}
      <div className="flex items-center gap-3">
        <span className="text-[12px] text-gray-400 tracking-widest hidden sm:block">SETTLEMENT PRICE SOURCE →</span>
        <ChainlinkBadge />
        <span className="text-[12px] text-gray-400 tracking-wide hidden md:block max-w-xs">
          遊戲結算以 Chainlink 鏈上報價為基準，非中心化 API
        </span>
      </div>
    </div>
  )
}
