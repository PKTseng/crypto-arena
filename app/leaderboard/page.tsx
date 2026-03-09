'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

// ── 型別 ──────────────────────────────────────────────────────
interface Player {
  id: number;
  name: string;
  avatar: string;
  winRate: number;
  totalProfit: number;
  bestStreak: number;
  rank: number;
  isMe?: boolean;
}

// ── Mock 初始資料（20 筆） ─────────────────────────────────────
const INITIAL_PLAYERS: Omit<Player, 'rank'>[] = [
  { id: 1,  name: 'SatoshiLord',   avatar: '👑', winRate: 0.84, totalProfit: 52400, bestStreak: 18 },
  { id: 2,  name: 'CryptoNinja',   avatar: '🥷', winRate: 0.79, totalProfit: 43800, bestStreak: 14 },
  { id: 3,  name: 'MoonHunter',    avatar: '🌙', winRate: 0.76, totalProfit: 38200, bestStreak: 12 },
  { id: 4,  name: 'BullRider',     avatar: '🐂', winRate: 0.72, totalProfit: 31500, bestStreak: 10 },
  { id: 5,  name: 'DiamondHands',  avatar: '💎', winRate: 0.70, totalProfit: 27800, bestStreak: 9  },
  { id: 6,  name: 'WhaleCaller',   avatar: '🐋', winRate: 0.68, totalProfit: 24100, bestStreak: 8  },
  { id: 0,  name: 'You',           avatar: '⚡', winRate: 0.65, totalProfit: 20400, bestStreak: 7, isMe: true },
  { id: 7,  name: 'DegenKing',     avatar: '👾', winRate: 0.63, totalProfit: 18200, bestStreak: 7  },
  { id: 8,  name: 'PumpMaster',    avatar: '🚀', winRate: 0.61, totalProfit: 16800, bestStreak: 6  },
  { id: 9,  name: 'TokenWizard',   avatar: '🧙', winRate: 0.59, totalProfit: 14500, bestStreak: 6  },
  { id: 10, name: 'AlphaSeeker',   avatar: '🦅', winRate: 0.57, totalProfit: 12800, bestStreak: 5  },
  { id: 11, name: 'FlashTrader',   avatar: '⚡', winRate: 0.56, totalProfit: 11200, bestStreak: 5  },
  { id: 12, name: 'ChainBreaker',  avatar: '⛓', winRate: 0.54, totalProfit:  9800, bestStreak: 4  },
  { id: 13, name: 'HODLKing',      avatar: '🏰', winRate: 0.53, totalProfit:  8600, bestStreak: 4  },
  { id: 14, name: 'GweiGoblin',    avatar: '👺', winRate: 0.52, totalProfit:  7400, bestStreak: 3  },
  { id: 15, name: 'RektSurvivor',  avatar: '😤', winRate: 0.51, totalProfit:  6300, bestStreak: 3  },
  { id: 16, name: 'LiquidHunter',  avatar: '🌊', winRate: 0.50, totalProfit:  5200, bestStreak: 3  },
  { id: 17, name: 'ShibaWarrior',  avatar: '🐕', winRate: 0.49, totalProfit:  4100, bestStreak: 2  },
  { id: 18, name: 'ApeFollower',   avatar: '🦍', winRate: 0.48, totalProfit:  3200, bestStreak: 2  },
  { id: 19, name: 'NewbieTrade',   avatar: '🌱', winRate: 0.46, totalProfit:  2100, bestStreak: 1  },
];

function addRanks(players: Omit<Player, 'rank'>[]): Player[] {
  return [...players]
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

// ── 獎牌樣式 ──────────────────────────────────────────────────
const MEDAL: Record<number, { label: string; border: string; bg: string; text: string; glow: string }> = {
  1: {
    label: '🥇',
    border: '#FFD700',
    bg:     'linear-gradient(135deg, #FFD70015, #FFA50008)',
    text:   '#FFD700',
    glow:   '0 0 24px #FFD70030',
  },
  2: {
    label: '🥈',
    border: '#C0C0C0',
    bg:     'linear-gradient(135deg, #C0C0C015, #A8A8A808)',
    text:   '#C0C0C0',
    glow:   '0 0 24px #C0C0C020',
  },
  3: {
    label: '🥉',
    border: '#CD7F32',
    bg:     'linear-gradient(135deg, #CD7F3215, #A0522D08)',
    text:   '#CD7F32',
    glow:   '0 0 24px #CD7F3220',
  },
};

const ME_STYLE = {
  border: '#00D4FF',
  bg:     'linear-gradient(135deg, #00D4FF18, #00D4FF08)',
  text:   '#00D4FF',
  glow:   '0 0 30px #00D4FF25',
};

// ── 單列元件 ──────────────────────────────────────────────────
function PlayerRow({ player, prevRank }: { player: Player; prevRank: number }) {
  const medal    = MEDAL[player.rank];
  const isMe     = player.isMe;
  const rankDiff = prevRank - player.rank; // 正 = 上升，負 = 下降

  const isPlain     = !isMe && !medal;
  const borderColor = isMe ? ME_STYLE.border : medal ? medal.border : undefined;
  const bg          = isMe ? ME_STYLE.bg     : medal ? medal.bg     : 'transparent';
  const nameColor   = isMe ? ME_STYLE.text   : medal ? medal.text   : undefined;
  const boxShadow   = isMe ? ME_STYLE.glow   : medal ? medal.glow   : 'none';

  return (
    <motion.div
      layout
      layoutId={`player-${player.id}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`grid items-center gap-2 px-4 py-3.5 rounded-2xl transition-colors ${isPlain ? 'border border-slate-200 dark:border-white/5' : ''}`}
      style={{
        gridTemplateColumns: '2.5rem 2.5rem 1fr repeat(3, auto)',
        background:   bg || 'transparent',
        border:       borderColor ? `1px solid ${borderColor}` : undefined,
        boxShadow,
      }}
    >
      {/* 名次 */}
      <div className="flex items-center justify-center">
        {medal ? (
          <span className="text-lg">{medal.label}</span>
        ) : (
          <span
            className="text-sm font-bold text-slate-400 dark:text-gray-600"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            #{player.rank}
          </span>
        )}
      </div>

      {/* 頭像 */}
      <div className="text-xl flex items-center justify-center">
        {player.avatar}
      </div>

      {/* 名稱 + 排名變動 */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`font-semibold text-sm truncate ${!isMe && !medal ? 'text-slate-800 dark:text-gray-200' : ''}`}
          style={{
            color: (isMe || medal) ? nameColor : undefined,
            fontFamily: isMe ? 'var(--font-orbitron)' : undefined,
          }}
        >
          {player.name}
          {isMe && (
            <span
              className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full border align-middle"
              style={{ borderColor: '#00D4FF40', color: '#00D4FF', background: '#00D4FF10' }}
            >
              YOU
            </span>
          )}
        </span>
        {rankDiff !== 0 && (
          <motion.span
            key={`${player.id}-${player.rank}`}
            initial={{ opacity: 0, y: rankDiff > 0 ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-bold shrink-0"
            style={{ color: rankDiff > 0 ? '#00FF88' : '#FF3366' }}
          >
            {rankDiff > 0 ? `▲${rankDiff}` : `▼${Math.abs(rankDiff)}`}
          </motion.span>
        )}
      </div>

      {/* 勝率 */}
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-[10px] text-slate-400 dark:text-gray-600 tracking-wider">WIN RATE</span>
        <span
          className="text-sm font-bold"
          style={{
            color: player.winRate >= 0.7 ? '#00FF88' : player.winRate >= 0.55 ? '#FFB800' : '#FF3366',
            fontFamily: 'var(--font-orbitron)',
          }}
        >
          {(player.winRate * 100).toFixed(1)}%
        </span>
      </div>

      {/* 最高連勝 */}
      <div className="hidden md:flex flex-col items-end">
        <span className="text-[10px] text-slate-400 dark:text-gray-600 tracking-wider">STREAK</span>
        <span
          className="text-sm font-bold text-orange-400"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          🔥 {player.bestStreak}
        </span>
      </div>

      {/* 總收益 */}
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-slate-400 dark:text-gray-600 tracking-wider">PROFIT</span>
        <motion.span
          key={Math.round(player.totalProfit / 100)}
          initial={{ color: '#00FF88' }}
          animate={{ color: 'inherit' }}
          transition={{ duration: 1 }}
          className="text-sm font-black text-slate-900 dark:text-white"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          ${Math.round(player.totalProfit).toLocaleString()}
        </motion.span>
      </div>
    </motion.div>
  );
}

// ── 主頁面 ────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const myScore     = useGameStore((s) => s.score);
  const myStreak    = useGameStore((s) => s.bestStreak);
  const myWins      = useGameStore((s) => s.wins);
  const myRounds    = useGameStore((s) => s.totalRounds);

  const [players, setPlayers] = useState<Player[]>(() => {
    const base = INITIAL_PLAYERS.map((p) =>
      p.isMe
        ? { ...p, totalProfit: myScore, bestStreak: myStreak, winRate: myRounds > 0 ? myWins / myRounds : 0.65 }
        : p
    );
    return addRanks(base);
  });

  const prevRanksRef = useRef<Record<number, number>>({});

  // 同步 "You" 的真實遊戲資料
  useEffect(() => {
    setPlayers((prev) =>
      addRanks(
        prev.map((p) =>
          p.isMe
            ? { ...p, totalProfit: myScore, bestStreak: myStreak, winRate: myRounds > 0 ? myWins / myRounds : p.winRate }
            : p
        )
      )
    );
  }, [myScore, myStreak, myWins, myRounds]);

  // 每 5s 模擬即時排名更新（僅調整非 "You" 的玩家）
  useEffect(() => {
    const id = setInterval(() => {
      setPlayers((prev) => {
        // 記住更新前的排名
        const snapshot: Record<number, number> = {};
        prev.forEach((p) => { snapshot[p.id] = p.rank; });
        prevRanksRef.current = snapshot;

        const updated = prev.map((p) => {
          if (p.isMe) return p;
          // 隨機調整 ±3% 收益
          const delta = p.totalProfit * (Math.random() - 0.48) * 0.03;
          const newWinRate = Math.min(0.99, Math.max(0.35, p.winRate + (Math.random() - 0.5) * 0.008));
          return { ...p, totalProfit: Math.max(500, p.totalProfit + delta), winRate: newWinRate };
        });
        return addRanks(updated);
      });
    }, 5000);

    return () => clearInterval(id);
  }, []);

  // 找自己的排名
  const myPlayer  = players.find((p) => p.isMe);
  const myRank    = myPlayer?.rank ?? '—';
  const lastUpdate = new Date().toLocaleTimeString('zh-TW', { hour12: false });

  return (
    <div
      className="min-h-[calc(100vh-8rem)] rounded-2xl -mx-4 sm:-mx-6 px-4 sm:px-6 py-8
                 bg-slate-50 dark:bg-[#0A0A0F] transition-colors duration-200"
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-8">

        {/* ── 標題區 ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ fontFamily: 'var(--font-orbitron)', color: '#00D4FF' }}
            >
              LEADERBOARD
            </h1>
            <p className="text-slate-400 dark:text-gray-600 text-sm mt-1 tracking-wider">GLOBAL RANKINGS</p>
          </div>

          {/* 自己的卡片 */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: '#00D4FF10',
              border: '1px solid #00D4FF30',
            }}
          >
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-[10px] text-gray-500 tracking-widest">YOUR RANK</p>
              <p
                className="text-2xl font-black"
                style={{ color: '#00D4FF', fontFamily: 'var(--font-orbitron)' }}
              >
                #{myRank}
              </p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 mx-1" />
            <div>
              <p className="text-[10px] text-gray-500 tracking-widest">PROFIT</p>
              <p
                className="text-lg font-black text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                ${myScore.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── 即時更新提示 ── */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="text-[11px] text-slate-400 dark:text-gray-600 tracking-widest">
            LIVE UPDATES EVERY 5S — LAST: {lastUpdate}
          </span>
        </div>

        {/* ── 排行榜列表 ── */}
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {players.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                prevRank={prevRanksRef.current[player.id] ?? player.rank}
              />
            ))}
          </AnimatePresence>
        </div>

        <p className="text-center text-[11px] tracking-widest pb-4 text-slate-300 dark:text-gray-800">
          * LEADERBOARD DATA IS SIMULATED FOR DEMO PURPOSES
        </p>
      </div>
    </div>
  );
}
