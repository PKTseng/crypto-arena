import { create } from 'zustand';
import type {
  GameState,
  GamePhase,
  PredictionDirection,
  RoundRecord,
  RoundResult,
} from '@/types';

const MAX_HISTORY_LENGTH = 10; // 保留最近 10 回合

// ── 勝負判定 ─────────────────────────────────────────────────
function determineResult(
  prediction: PredictionDirection,
  lockedPrice: number,
  settledPrice: number
): RoundResult {
  const delta = settledPrice - lockedPrice;
  if (delta === 0) return 'draw';
  if (prediction === 'up') return delta > 0 ? 'win' : 'lose';
  return delta < 0 ? 'win' : 'lose';
}

// ── 分數計算 ──────────────────────────────────────────────────
function calculateScore(result: RoundResult, streak: number): number {
  if (result === 'win') return 100 + streak * 10; // 連勝加成
  if (result === 'lose') return -50;
  return 0; // draw 不加減分
}

export const useGameStore = create<GameState>((set, get) => ({
  // ── Initial State ──────────────────────────────────────────
  phase: 'idle',
  prediction: null,
  lockedPrice: null,
  roundResult: null,
  score: 0,
  streak: 0,
  bestStreak: 0,
  totalRounds: 0,
  wins: 0,
  history: [],
  betAmount: 100,

  // ── Actions ────────────────────────────────────────────────

  /** 開始新回合：進入 betting 階段，清除上一回合狀態 */
  startRound: () =>
    set({
      phase: 'betting',
      prediction: null,
      lockedPrice: null,
      roundResult: null,
    }),

  /** 玩家選擇預測方向 */
  placePrediction: (direction: PredictionDirection) => {
    const { phase } = get();
    if (phase !== 'betting') return;
    set({ prediction: direction });
  },

  /** 倒數結束，鎖定當前價格，進入 locked 階段 */
  lockRound: (lockedPrice: number) => {
    const { phase, prediction } = get();
    // 沒有預測方向時不鎖定（玩家未選擇）
    if (phase !== 'betting' || prediction === null) return;
    set({ phase: 'locked', lockedPrice });
  },

  /** 結算回合：計算勝負、更新分數與歷史 */
  settleRound: (settledPrice: number) => {
    const { phase, prediction, lockedPrice, streak, bestStreak, score, totalRounds, wins, history, betAmount } = get();
    if (phase !== 'locked' || prediction === null || lockedPrice === null) return;

    const result = determineResult(prediction, lockedPrice, settledPrice);
    const newStreak = result === 'win' ? streak + 1 : 0;
    const newBestStreak = Math.max(bestStreak, newStreak);
    const scoreDelta = calculateScore(result, streak);
    const newScore = Math.max(0, score + scoreDelta); // 分數不低於 0

    const record: RoundRecord = {
      id: totalRounds + 1,
      prediction,
      lockedPrice,
      settledPrice,
      priceDelta: settledPrice - lockedPrice,
      result,
      betAmount,
      timestamp: Date.now(),
    };

    const newHistory = [record, ...history].slice(0, MAX_HISTORY_LENGTH);

    set({
      phase: 'result',
      roundResult: result,
      score: newScore,
      streak: newStreak,
      bestStreak: newBestStreak,
      totalRounds: totalRounds + 1,
      wins: result === 'win' ? wins + 1 : wins,
      history: newHistory,
    });
  },

  /** 重置遊戲（保留歷史，只重置分數與狀態） */
  resetGame: () =>
    set({
      phase: 'idle',
      prediction: null,
      lockedPrice: null,
      roundResult: null,
      score: 0,
      streak: 0,
      totalRounds: 0,
      wins: 0,
      history: [],
      // bestStreak 刻意保留，作為個人紀錄
    }),

  setBetAmount: (amount: number) => set({ betAmount: amount }),
}));
