'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { formatTimestamp, formatPriceDelta } from '@/lib/utils';
import type { RoundHistoryProps } from '@/types';

export default function RoundHistory({ history, maxItems = 10 }: RoundHistoryProps) {
  const items = history.slice(0, maxItems);

  if (!items.length) {
    return (
      <div className="text-center text-gray-600 text-sm py-8">
        尚無回合記錄
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {items.map((record) => (
          <motion.div
            key={record.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3"
          >
            {/* 左：回合編號 + 時間 */}
            <div className="flex flex-col">
              <span className="text-gray-300 text-sm font-semibold">
                回合 #{record.id}
              </span>
              <span className="text-gray-600 text-xs">
                {formatTimestamp(record.timestamp)}
              </span>
            </div>

            {/* 中：預測方向 */}
            <Badge variant={record.prediction === 'up' ? 'up' : 'down'}>
              {record.prediction === 'up' ? '▲ UP' : '▼ DOWN'}
            </Badge>

            {/* 右：價差 + 結果 */}
            <div className="flex flex-col items-end gap-1">
              <span
                className={`font-mono text-sm font-semibold ${
                  record.priceDelta > 0 ? 'text-green-400' :
                  record.priceDelta < 0 ? 'text-red-400' :
                  'text-gray-400'
                }`}
              >
                {formatPriceDelta(record.priceDelta)}
              </span>
              <Badge variant={record.result}>
                {record.result === 'win' ? 'WIN' : record.result === 'lose' ? 'LOSE' : 'DRAW'}
              </Badge>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
