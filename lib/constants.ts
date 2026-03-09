// ── Binance ───────────────────────────────────────────────────
export const BINANCE_WS_URL   = 'wss://stream.binance.com:9443/ws/btcusdt@trade';
export const BINANCE_TICKER_URL = 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT';

// ── Chainlink Oracle ──────────────────────────────────────────
// BTC/USD Price Feed on Ethereum Mainnet
// https://docs.chain.link/data-feeds/price-feeds/addresses
// 全小寫，useChainlinkPrice 內用 getAddress() 正規化為 EIP-55 checksum
// Chainlink BTC/USD Proxy on Ethereum Mainnet（40 hex chars）
export const CHAINLINK_BTC_USD_ADDRESS = '0xf4030086522a5beea4988f8ca5b36dbc97bee88c';
export const CHAINLINK_BTC_USD_DECIMALS = 8;
export const CHAINLINK_POLL_INTERVAL_MS = 30_000; // 30s（feed 約每小時或 0.5% 偏差才更新）
export const CHAINLINK_STALE_THRESHOLD_MS = 3_600_000; // 超過 1 小時視為 stale
export const CHAINLINK_PUBLIC_RPC = 'https://eth.llamarpc.com';

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
