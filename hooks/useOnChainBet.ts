'use client';

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { ARENA_BET_ADDRESS, ARENA_BET_ABI } from '@/lib/contracts';

export type TxStatus = 'idle' | 'signing' | 'pending' | 'confirmed' | 'error';

export function useOnChainBet() {
  const chainId = useChainId();

  // ── Step 1: sign + broadcast ─────────────────────────────────────────
  const {
    writeContract,
    data:      hash,
    isPending: isSigning,
    error:     writeError,
    reset,
  } = useWriteContract();

  // ── Step 2: wait for on-chain confirmation ───────────────────────────
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error:     receiptError,
  } = useWaitForTransactionReceipt({ hash });

  // ── Unified status ────────────────────────────────────────────────────
  const status: TxStatus =
    isSigning    ? 'signing'   :
    isConfirming ? 'pending'   :
    isConfirmed  ? 'confirmed' :
    (writeError || receiptError) ? 'error' : 'idle';

  const error = writeError ?? receiptError;

  // ── isCorrectChain: must be on Sepolia (11155111) ─────────────────────
  const isCorrectChain = chainId === 11155111;

  /**
   * Record a prediction on-chain via CryptoArenaBet.placeBet()
   *
   * @param direction   'up' | 'down'
   * @param lockedPrice BTC price at time of bet (e.g. 67475.10)
   * @param betAmount   Game-point wager
   */
  function recordBet(
    direction:   'up' | 'down',
    lockedPrice: number,
    betAmount:   number,
  ) {
    if (!ARENA_BET_ADDRESS) {
      console.warn(
        '[CryptoArena] Contract not deployed — add NEXT_PUBLIC_ARENA_BET_ADDRESS to .env.local'
      );
      return;
    }

    writeContract({
      address:      ARENA_BET_ADDRESS,
      abi:          ARENA_BET_ABI,
      functionName: 'placeBet',
      args: [
        direction === 'up' ? 0 : 1,            // uint8: 0=UP 1=DOWN
        BigInt(Math.round(lockedPrice * 100)), // price × 100 (cents)
        BigInt(betAmount),
      ],
    });
  }

  return {
    recordBet,
    hash,
    status,
    error,
    reset,
    isCorrectChain,
  };
}
