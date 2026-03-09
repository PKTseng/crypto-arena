'use client';

import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]:  http('https://eth.llamarpc.com'),
      [sepolia.id]:  http('https://rpc.sepolia.org'),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
    appName: 'CryptoArena',
    appDescription: 'BTC 漲跌預測競技平台',
  })
);

const connectKitTheme = {
  '--ck-font-family': 'var(--font-dm-sans, sans-serif)',
  '--ck-border-radius': '16px',
  '--ck-overlay-background': 'rgba(0,0,0,0.8)',
  '--ck-body-background': '#0D1117',
  '--ck-body-color': '#ffffff',
  '--ck-primary-button-background': '#00D4FF',
  '--ck-primary-button-color': '#000000',
  '--ck-primary-button-border-radius': '12px',
  '--ck-connectbutton-background': 'transparent',
  '--ck-connectbutton-border': '1px solid #00D4FF40',
  '--ck-connectbutton-color': '#00D4FF',
  '--ck-connectbutton-border-radius': '10px',
  '--ck-connectbutton-hover-background': '#00D4FF15',
} as React.CSSProperties;

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  // QueryClient 要在 Client Component 內建立，避免 SSR 共享
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 60_000 },
    },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={connectKitTheme} mode="dark">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
