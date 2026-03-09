'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { TxStatus } from '@/hooks/useOnChainBet';

interface Props {
  status:  TxStatus;
  hash?:   `0x${string}`;
  onReset?: () => void;
}

const SEPOLIA_EXPLORER = 'https://sepolia.etherscan.io';

const STATUS_CONFIG: Record<
  Exclude<TxStatus, 'idle'>,
  { color: string; icon: string; label: string; spin?: boolean }
> = {
  signing:   { color: '#FFB800', icon: '✍️',  label: 'Waiting for wallet…'  },
  pending:   { color: '#00D4FF', icon: '⏳',  label: 'Broadcasting…', spin: true },
  confirmed: { color: '#00FF88', icon: '✅',  label: 'Confirmed on Sepolia!' },
  error:     { color: '#FF3366', icon: '❌',  label: 'Transaction failed'    },
};

export default function TxStatusBadge({ status, hash, onReset }: Props) {
  if (status === 'idle') return null;

  const cfg = STATUS_CONFIG[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: -8, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs w-full"
        style={{
          background: `${cfg.color}12`,
          border:     `1px solid ${cfg.color}40`,
        }}
      >
        {/* Icon */}
        <span className={cfg.spin ? 'animate-pulse' : ''}>{cfg.icon}</span>

        {/* Label */}
        <span
          className="font-bold tracking-wider flex-1 truncate"
          style={{ color: cfg.color, fontFamily: 'var(--font-orbitron)' }}
        >
          {cfg.label}
        </span>

        {/* Tx hash → Etherscan link */}
        {hash && (
          <a
            href={`${SEPOLIA_EXPLORER}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] underline shrink-0 hover:opacity-100 transition-opacity"
            style={{ color: cfg.color, opacity: 0.75 }}
          >
            {hash.slice(0, 6)}…{hash.slice(-4)} ↗
          </a>
        )}

        {/* Dismiss button for terminal states */}
        {(status === 'confirmed' || status === 'error') && onReset && (
          <button
            onClick={onReset}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: cfg.color }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
