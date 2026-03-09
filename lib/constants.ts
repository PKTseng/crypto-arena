// ── Binance ───────────────────────────────────────────────────
export const BINANCE_WS_URL   = 'wss://stream.binance.com:9443/ws/btcusdt@trade';
export const BINANCE_TICKER_URL = 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT';

// ── WebSocket ─────────────────────────────────────────────────
export const WS_RECONNECT_BASE_MS = 1000;
export const WS_RECONNECT_MAX_MS  = 30000;
export const WS_PING_INTERVAL_MS  = 20000;

// ── Price Chart ───────────────────────────────────────────────
export const MAX_PRICE_HISTORY = 120; // 約 2 分鐘的資料點

// ── Game ──────────────────────────────────────────────────────
export const BETTING_DURATION_SEC  = 10; // 下注倒數秒數
export const LOCK_DURATION_SEC     = 15; // 鎖定等待結算秒數
export const RESULT_DISPLAY_SEC    = 3;  // 結果顯示秒數
export const MAX_ROUND_HISTORY     = 10; // 保留最近幾回合

// ── Score ─────────────────────────────────────────────────────
export const SCORE_WIN_BASE    = 100;
export const SCORE_WIN_STREAK  = 10;  // 每連勝加成
export const SCORE_LOSE        = -50;
