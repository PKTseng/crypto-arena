// ============================================================
// WebSocket & Price Types
// ============================================================

/** 從 Binance WebSocket trade 事件解析出的原始資料 */
export interface BinanceTradeEvent {
  e: 'trade';        // 事件類型
  E: number;         // 事件時間 (ms)
  s: string;         // 交易對，e.g. "BTCUSDT"
  t: number;         // Trade ID
  p: string;         // 成交價格（字串）
  q: string;         // 成交數量（字串）
  T: number;         // 成交時間 (ms)
  m: boolean;        // 是否為 maker 訂單
}

/** 解析後的價格資料點，用於 priceHistory 與圖表 */
export interface TradePoint {
  price: number;
  quantity: number;
  timestamp: number; // Unix ms
}

/** WebSocket 連線狀態 */
export type WebSocketStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

// ============================================================
// Game Types
// ============================================================

/** 玩家的預測方向 */
export type PredictionDirection = 'up' | 'down';

/** 回合結果 */
export type RoundResult = 'win' | 'lose' | 'draw';

/** 遊戲回合階段 */
export type GamePhase =
  | 'idle'      // 尚未開始
  | 'betting'   // 下注倒數中（玩家可選擇方向）
  | 'locked'    // 已鎖定，等待結算
  | 'result';   // 顯示回合結果

/** 單一回合的完整紀錄 */
export interface RoundRecord {
  id: number;
  prediction: PredictionDirection;
  lockedPrice: number;      // 鎖定時的 BTC 價格
  settledPrice: number;     // 結算時的 BTC 價格
  priceDelta: number;       // settledPrice - lockedPrice
  result: RoundResult;
  betAmount: number;        // 下注金額（虛擬）
  timestamp: number;        // 回合開始時間 (Unix ms)
}

// ============================================================
// Store Types
// ============================================================

/** priceStore 的 state 結構 */
export interface PriceState {
  currentPrice: number;
  priceChange24h: number;         // 24h 漲跌百分比
  priceHistory: TradePoint[];     // 近期價格點，給圖表使用
  wsStatus: WebSocketStatus;

  // Actions
  setCurrentPrice: (point: TradePoint) => void;
  setPriceChange24h: (change: number) => void;
  setWsStatus: (status: WebSocketStatus) => void;
  clearHistory: () => void;
}

/** gameStore 的 state 結構 */
export interface GameState {
  phase: GamePhase;
  prediction: PredictionDirection | null;
  lockedPrice: number | null;
  roundResult: RoundResult | null;
  score: number;
  streak: number;             // 當前連勝數
  bestStreak: number;         // 歷史最高連勝
  totalRounds: number;
  wins: number;
  history: RoundRecord[];     // 最近 N 回合紀錄
  betAmount: number;          // 當前回合下注金額

  // Actions
  startRound: () => void;
  placePrediction: (direction: PredictionDirection) => void;
  lockRound: (lockedPrice: number) => void;
  settleRound: (settledPrice: number) => void;
  resetGame: () => void;
  setBetAmount: (amount: number) => void;
}

// ============================================================
// Component Prop Types
// ============================================================

export interface PriceChartProps {
  data: TradePoint[];
  height?: number;
}

export interface PredictionPanelProps {
  phase: GamePhase;
  onPredict: (direction: PredictionDirection) => void;
  timeLeft: number;           // 倒數秒數
  totalTime: number;          // 回合總秒數
}

export interface CountdownTimerProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
}

export interface ResultOverlayProps {
  result: RoundResult;
  priceDelta: number;
  onClose: () => void;
}

export interface RoundHistoryProps {
  history: RoundRecord[];
  maxItems?: number;
}

export interface ScoreBoardProps {
  score: number;
  streak: number;
  bestStreak: number;
  totalRounds: number;
  wins: number;
}

// ============================================================
// Utility Types
// ============================================================

/** 通用的連勝數計算輸入 */
export interface StreakInfo {
  current: number;
  best: number;
}

/** 勝率計算輸出 */
export interface WinRateInfo {
  wins: number;
  totalRounds: number;
  winRate: number;            // 0 ~ 1
}

/** 格式化後的價格顯示資料 */
export interface FormattedPrice {
  integer: string;            // 千分位整數部分，e.g. "67,432"
  decimal: string;            // 小數部分，e.g. "50"
  isPositive: boolean;        // 用於顏色判斷
}
