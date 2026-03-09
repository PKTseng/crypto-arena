'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import { formatWinRate, calcWinRate } from '@/lib/utils';
import type { ScoreBoardProps } from '@/types';

interface StatItemProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatItem({ label, value, highlight }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
      <motion.span
        key={String(value)}
        initial={{ scale: 1.3, color: '#fbbf24' }}
        animate={{ scale: 1, color: highlight ? '#facc15' : '#ffffff' }}
        transition={{ duration: 0.4 }}
        className="font-mono font-bold text-xl"
      >
        {value}
      </motion.span>
    </div>
  );
}

export default function ScoreBoard({
  score,
  streak,
  bestStreak,
  totalRounds,
  wins,
}: ScoreBoardProps) {
  const { winRate } = calcWinRate(wins, totalRounds);

  return (
    <Card className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <StatItem label="Score" value={score.toLocaleString()} highlight />
        <StatItem label="Streak 🔥" value={streak} />
        <StatItem label="Best Streak" value={bestStreak} />
        <StatItem
          label="Win Rate"
          value={totalRounds === 0 ? '—' : formatWinRate(winRate)}
        />
      </div>

      {/* 連勝加成提示 */}
      {streak >= 2 && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-yellow-400 text-xs mt-4"
        >
          🔥 連勝 {streak} 場！每次勝利額外獲得 +{streak * 10} 分
        </motion.p>
      )}
    </Card>
  );
}
