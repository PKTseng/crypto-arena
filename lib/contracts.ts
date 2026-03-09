// ── Contract address (set after deployment) ───────────────────────────────
// Add NEXT_PUBLIC_ARENA_BET_ADDRESS=0x... to .env.local after running:
//   npx hardhat run scripts/deploy.ts --network sepolia
export const ARENA_BET_ADDRESS = (
  process.env.NEXT_PUBLIC_ARENA_BET_ADDRESS ?? ''
) as `0x${string}`;

// ── ABI (only the functions/events the frontend uses) ─────────────────────
export const ARENA_BET_ABI = [
  // ── placeBet(direction, lockedPrice, betAmount) → betId ──────────────
  {
    name:             'placeBet',
    type:             'function',
    stateMutability:  'nonpayable',
    inputs: [
      { name: 'direction',   type: 'uint8'   },
      { name: 'lockedPrice', type: 'uint256' },
      { name: 'betAmount',   type: 'uint256' },
    ],
    outputs: [{ name: 'betId', type: 'uint256' }],
  },

  // ── settleBet(betId, settlementPrice) ─────────────────────────────────
  {
    name:             'settleBet',
    type:             'function',
    stateMutability:  'nonpayable',
    inputs: [
      { name: 'betId',            type: 'uint256' },
      { name: 'settlementPrice',  type: 'uint256' },
    ],
    outputs: [],
  },

  // ── getBet(betId) → BetRecord ─────────────────────────────────────────
  {
    name:             'getBet',
    type:             'function',
    stateMutability:  'view',
    inputs:  [{ name: 'betId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'player',      type: 'address' },
          { name: 'direction',   type: 'uint8'   },
          { name: 'lockedPrice', type: 'uint256' },
          { name: 'betAmount',   type: 'uint256' },
          { name: 'timestamp',   type: 'uint256' },
          { name: 'settled',     type: 'bool'    },
          { name: 'won',         type: 'bool'    },
        ],
      },
    ],
  },

  // ── getPlayerBetIds(player) → uint256[] ──────────────────────────────
  {
    name:             'getPlayerBetIds',
    type:             'function',
    stateMutability:  'view',
    inputs:  [{ name: 'player', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
  },

  // ── totalBets() → uint256 ─────────────────────────────────────────────
  {
    name:             'totalBets',
    type:             'function',
    stateMutability:  'view',
    inputs:           [],
    outputs:          [{ type: 'uint256' }],
  },

  // ── Event: BetPlaced ──────────────────────────────────────────────────
  {
    name: 'BetPlaced',
    type: 'event',
    inputs: [
      { name: 'betId',       type: 'uint256', indexed: true  },
      { name: 'player',      type: 'address', indexed: true  },
      { name: 'direction',   type: 'uint8',   indexed: false },
      { name: 'lockedPrice', type: 'uint256', indexed: false },
      { name: 'betAmount',   type: 'uint256', indexed: false },
      { name: 'timestamp',   type: 'uint256', indexed: false },
    ],
  },

  // ── Event: BetSettled ─────────────────────────────────────────────────
  {
    name: 'BetSettled',
    type: 'event',
    inputs: [
      { name: 'betId',            type: 'uint256', indexed: true  },
      { name: 'player',           type: 'address', indexed: true  },
      { name: 'won',              type: 'bool',    indexed: false },
      { name: 'settlementPrice',  type: 'uint256', indexed: false },
    ],
  },
] as const;
