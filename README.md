# ₿ CryptoArena

> 即時 BTC 漲跌預測競技平台 — 考驗你的市場直覺

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![wagmi](https://img.shields.io/badge/wagmi-2-purple)

---

## 專案簡介

CryptoArena 是一個以 **真實 BTC 市場資料** 驅動的預測遊戲平台。玩家在每回合開始時，選擇下一段時間內 BTC 價格是「上漲」或「下跌」，並與其他玩家競爭排行榜名次。

所有價格資料透過 **Binance WebSocket** 串流即時取得，非模擬數據。

---

## 功能特色

### 遊戲核心
- **即時行情** — 透過 Binance WebSocket (`btcusdt@trade`) 串流成交資料，毫秒級更新
- **回合制預測** — 每回合 10 秒下注，15 秒後結算，自動進入下一回合
- **連勝加成** — 連續答對每局額外 +10 分，最高無上限
- **全屏特效** — 勝利時綠色光暈動畫，失敗時畫面震動 + 紅色閃爍

### 價格圖表
- Recharts AreaChart，顯示最近 60 筆 trade 資料點
- 依漲跌自動切換顏色（綠/紅）與 gradient fill
- 起始價格基準虛線，直觀判斷當前相對位置

### 排行榜
- 全球 20 名玩家排名，每 5 秒模擬即時更新
- 前三名金/銀/銅獎牌視覺
- 「你」的排名高亮顯示，自動同步遊戲分數

### 錢包整合
- 支援 MetaMask、WalletConnect 等主流錢包（wagmi v2 + ConnectKit）
- 連接後顯示縮寫地址 `0x1234...5678`
- 連線狀態燈號即時反映

### 技術亮點
- WebSocket 自動重連（Exponential Backoff：1s → 2s → 4s → 最長 30s）
- 心跳機制（每 20s ping），防止閒置斷線
- Zustand 狀態分層（`priceStore` 市場資料 / `gameStore` 遊戲邏輯）
- TypeScript 全覆蓋，零 `any`

---

## 技術棧

| 分類 | 技術 |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Chart | Recharts 2 |
| State | Zustand 4 |
| Web3 | wagmi v2 + ConnectKit + viem |
| Data | Binance WebSocket API |
| Font | Orbitron (display) / Inter (body) |

---

## 快速開始

### 1. 安裝依賴

```bash
git clone https://github.com/your-username/crypto-arena.git
cd crypto-arena
npm install
```

### 2. 設定環境變數

```bash
cp .env.local.example .env.local
```

編輯 `.env.local`：

```env
# 在 https://cloud.walletconnect.com 免費申請
# 未填寫時 MetaMask 注入錢包仍可正常使用
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000)

---

## 頁面說明

### `/` — 首頁
專案介紹與遊戲規則說明，點擊「開始遊戲」進入 Arena。

### `/arena` — 競技場（主要頁面）
```
┌─────────────────────────────────────────────┐
│  BTC/USDT  $67,432.50  +2.14%   ● LIVE      │  ← 即時價格 + 狀態
├──────────────────────────┬──────────────────┤
│                          │  [倒數圓環]       │
│   BTC 即時走勢圖          │  ▲ UP  ▼ DOWN   │  ← 預測面板
│   (最近 60 筆成交)        │  [下注金額]      │
│                          │                  │
├──────────────────────────┴──────────────────┤
│  # 回合  方向  價差  下注  結果              │  ← 最近 5 筆記錄
└─────────────────────────────────────────────┘
```

**操作步驟：**
1. 等待倒數開始（10 秒）
2. 點擊 **▲ UP** 或 **▼ DOWN** 做出預測
3. 選擇後按鈕自動鎖定，等待 15 秒結算
4. 結果出現後自動進入下一回合

### `/game` — 遊戲（簡化版）
功能與 Arena 相同，UI 較輕量，包含完整回合歷史（最近 10 筆）。

### `/leaderboard` — 排行榜
全球玩家排名，你的分數會自動反映遊戲結果。

---

## 計分規則

| 情況 | 分數 |
|---|---|
| 預測正確 | +100 + 連勝數 × 10 |
| 預測錯誤 | -50（最低為 0） |
| 平局（價格不變） | ±0 |

**連勝加成範例：**
- 1 連勝：+110 分
- 3 連勝：+130 分
- 10 連勝：+200 分

---

## 專案結構

```
crypto-arena/
├── app/
│   ├── arena/          # 競技場主頁面
│   ├── game/           # 簡化版遊戲頁面
│   ├── leaderboard/    # 排行榜
│   └── layout.tsx      # 根 Layout（字體、Provider）
├── components/
│   ├── arena/          # Arena 專屬元件
│   ├── chart/          # 價格圖表元件
│   ├── game/           # 遊戲邏輯元件
│   ├── layout/         # Navbar、LivePriceBanner
│   ├── ui/             # 通用 UI（Button、Card、Badge）
│   └── wallet/         # ConnectButton
├── hooks/
│   ├── useBinanceWS.ts # WebSocket 連線管理（含自動重連）
│   ├── useGameLogic.ts # 遊戲狀態機（計時器驅動）
│   └── usePriceHistory.ts
├── store/
│   ├── priceStore.ts   # 市場資料（price、history、wsStatus）
│   └── gameStore.ts    # 遊戲狀態（phase、score、history）
├── providers/
│   └── WalletProvider.tsx  # wagmi + ConnectKit 初始化
├── lib/
│   ├── constants.ts    # 常數（WS URL、回合秒數、計分）
│   └── utils.ts        # 格式化工具函式
└── types/
    └── index.ts        # 全域 TypeScript 型別
```

---

## 資料流

```
Binance WebSocket
      │
      ▼
useBinanceWS (hook)
      │
      ├──▶ priceStore.currentPrice  ──▶ PriceHeader, PriceTickerBar
      │
      ├──▶ priceStore.priceHistory  ──▶ ArenaChart, PriceChart
      │
      └──▶ priceStore.wsStatus      ──▶ LivePriceBanner (連線燈號)

useGameLogic (狀態機)
      │
      idle ──▶ betting ──▶ locked ──▶ result ──▶ betting...
                  │           │          │
              placePrediction  lockRound  settleRound
                              (priceStore)  (priceStore)
                                    │
                                    ▼
                              gameStore.history, score, streak
```

---

## 本地開發注意事項

- `reactStrictMode` 設為 `false`，避免 React 18 開發模式雙重執行 `useEffect` 導致 WebSocket 連線警告
- MetaMask SDK 的 React Native 依賴透過 `mocks/async-storage.js` stub 替代，無需安裝 React Native 套件
- 如果 Binance WebSocket 在你的地區受限，可考慮使用 VPN 或替換為其他交易所的 WS endpoint

---

## License

MIT
