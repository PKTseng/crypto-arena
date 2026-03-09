'use client';

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';

/** 縮寫錢包地址 0x1234...5678 */
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ConnectButton() {
  const { address, isConnected } = useAccount();

  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, show }) => (
        <button
          onClick={show}
          disabled={isConnecting}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 select-none"
          style={{
            background:   isConnected ? '#00D4FF12' : 'transparent',
            border:       `1px solid ${isConnected ? '#00D4FF40' : '#ffffff15'}`,
            color:        isConnected ? '#00D4FF' : '#9ca3af',
            fontFamily:   'var(--font-orbitron, monospace)',
            fontSize:     '11px',
            letterSpacing: '0.05em',
          }}
        >
          {/* 連線狀態燈 */}
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              background:  isConnected ? '#00FF88' : '#4b5563',
              boxShadow:   isConnected ? '0 0 6px #00FF88' : 'none',
            }}
          />
          {isConnecting
            ? 'CONNECTING...'
            : isConnected && address
            ? truncateAddress(address)
            : 'CONNECT WALLET'}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
}
