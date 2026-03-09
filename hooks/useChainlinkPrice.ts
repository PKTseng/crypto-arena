import { useEffect, useRef } from 'react';
import { createPublicClient, http, getAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { usePriceStore } from '@/store/priceStore';
import {
  CHAINLINK_BTC_USD_ADDRESS,
  CHAINLINK_BTC_USD_DECIMALS,
  CHAINLINK_POLL_INTERVAL_MS,
  CHAINLINK_PUBLIC_RPC,
} from '@/lib/constants';

// ── Chainlink AggregatorV3Interface ABI（只取需要的函式）────────
const AGGREGATOR_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { name: 'roundId',         type: 'uint80'   },
      { name: 'answer',          type: 'int256'   }, // price * 10^decimals
      { name: 'startedAt',       type: 'uint256'  },
      { name: 'updatedAt',       type: 'uint256'  }, // Unix timestamp (seconds)
      { name: 'answeredInRound', type: 'uint80'   },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// ── viem Public Client（只讀，不需要錢包）────────────────────────
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(CHAINLINK_PUBLIC_RPC),
});

// ── Hook ─────────────────────────────────────────────────────
/**
 * 透過 viem readContract 定期讀取 Chainlink BTC/USD Price Feed。
 * 結果儲存在 priceStore.chainlinkPrice，供遊戲結算使用。
 *
 * 合約地址：0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88
 * Feed:     BTC/USD on Ethereum Mainnet
 */
export function useChainlinkPrice() {
  const setChainlinkData   = usePriceStore((s) => s.setChainlinkData);
  const setChainlinkStatus = usePriceStore((s) => s.setChainlinkStatus);
  const isMounted          = useRef(false);
  const timerRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrice = async () => {
    if (!isMounted.current) return;

    try {
      const result = await publicClient.readContract({
        address:      getAddress(CHAINLINK_BTC_USD_ADDRESS), // 轉為 EIP-55 checksum 格式
        abi:          AGGREGATOR_ABI,
        functionName: 'latestRoundData',
      });

      if (!isMounted.current) return;

      const [roundId, answer, , updatedAt] = result;

      // answer 是 int256，decimals = 8 → 除以 10^8 得到 USD 價格
      const price       = Number(answer) / 10 ** CHAINLINK_BTC_USD_DECIMALS;
      const updatedAtMs = Number(updatedAt) * 1000; // 轉為 ms

      setChainlinkData(price, updatedAtMs, roundId.toString());
    } catch (err) {
      if (!isMounted.current) return;
      console.warn('[Chainlink] Failed to fetch price:', err);
      setChainlinkStatus('error');
    }
  };

  useEffect(() => {
    isMounted.current = true;
    setChainlinkStatus('loading');

    // 立即抓一次
    fetchPrice();

    // 之後每 30s 更新（Chainlink 更新頻率約 1hr 或 0.5% 偏差）
    timerRef.current = setInterval(fetchPrice, CHAINLINK_POLL_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
