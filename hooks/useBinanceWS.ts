import { useEffect, useRef, useCallback } from 'react';
import { usePriceStore } from '@/store/priceStore';
import type { BinanceTradeEvent, TradePoint } from '@/types';

// ── 常數 ──────────────────────────────────────────────────────
const WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@trade';
const TICKER_URL = 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT';

const RECONNECT_BASE_MS = 1000;   // 初始重連等待
const RECONNECT_MAX_MS  = 30000;  // 最長重連等待
const PING_INTERVAL_MS  = 20000;  // 心跳間隔

// ── Hook ──────────────────────────────────────────────────────
export function useBinanceWS() {
  const setCurrentPrice  = usePriceStore((s) => s.setCurrentPrice);
  const setPriceChange24h = usePriceStore((s) => s.setPriceChange24h);
  const setWsStatus      = usePriceStore((s) => s.setWsStatus);

  const wsRef            = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimer        = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted        = useRef(false);

  // ── 解析 Binance trade 事件 ─────────────────────────────────
  const parseTradeEvent = useCallback((raw: string): TradePoint | null => {
    try {
      const event = JSON.parse(raw) as BinanceTradeEvent;
      if (event.e !== 'trade') return null;

      return {
        price:     parseFloat(event.p),
        quantity:  parseFloat(event.q),
        timestamp: event.T,
      };
    } catch {
      return null;
    }
  }, []);

  // ── 清除計時器 ──────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    if (pingTimer.current) {
      clearInterval(pingTimer.current);
      pingTimer.current = null;
    }
  }, []);

  // ── 關閉現有連線 ────────────────────────────────────────────
  const closeWS = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null; // 防止觸發重連
      wsRef.current.close();
      wsRef.current = null;
    }
    clearTimers();
  }, [clearTimers]);

  // ── 建立 WebSocket 連線 ─────────────────────────────────────
  const connect = useCallback(() => {
    if (!isMounted.current) return;

    closeWS();
    setWsStatus(reconnectAttempt.current === 0 ? 'connecting' : 'reconnecting');

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted.current) return;
      reconnectAttempt.current = 0;
      setWsStatus('connected');

      // 心跳：每 20s 送 ping 保持連線
      pingTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ method: 'ping' }));
        }
      }, PING_INTERVAL_MS);
    };

    ws.onmessage = (event: MessageEvent) => {
      if (!isMounted.current) return;
      const point = parseTradeEvent(event.data as string);
      if (point) setCurrentPrice(point);
    };

    ws.onerror = () => {
      // onerror 後必定觸發 onclose，讓 onclose 統一處理重連
    };

    ws.onclose = () => {
      if (!isMounted.current) return;
      clearTimers();
      setWsStatus('reconnecting');

      // Exponential backoff
      const delay = Math.min(
        RECONNECT_BASE_MS * 2 ** reconnectAttempt.current,
        RECONNECT_MAX_MS
      );
      reconnectAttempt.current += 1;

      reconnectTimer.current = setTimeout(() => {
        connect();
      }, delay);
    };
  }, [closeWS, setCurrentPrice, setWsStatus, parseTradeEvent, clearTimers]);

  // ── 取得 24h 漲跌幅（REST，只需抓一次）──────────────────────
  const fetch24hChange = useCallback(async () => {
    try {
      const res  = await fetch(TICKER_URL);
      const data = await res.json() as { priceChangePercent: string };
      setPriceChange24h(parseFloat(data.priceChangePercent));
    } catch {
      // 失敗時靜默忽略，不影響主要功能
    }
  }, [setPriceChange24h]);

  // ── 生命週期 ────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    connect();
    fetch24hChange();

    return () => {
      isMounted.current = false;
      closeWS();
      setWsStatus('disconnected');
    };
  }, [connect, closeWS, fetch24hChange, setWsStatus]);

  // 此 hook 不需回傳值，狀態統一由 store 管理
}
