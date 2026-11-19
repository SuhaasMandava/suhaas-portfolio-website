// ============================================================
//  /api/quotes  —  live stock quotes for the Research ticker.
//
//  Runs SERVER-SIDE as a Cloudflare Pages Function so the API key never
//  touches the browser. The page only ever fetches same-origin
//  /api/quotes, so the site's strict Content-Security-Policy stays as is.
//
//  Setup (one time):
//    1. Get a free token at https://finnhub.io  (real-time US stocks).
//    2. Cloudflare dashboard > Workers & Pages > this project >
//       Settings > Variables and Secrets: add FINNHUB_API_KEY as a Secret.
//    3. Redeploy.
// ============================================================

import { cachedJson } from "../_lib.js";

// Edit this watchlist to whatever you want the ticker to track.
const SYMBOLS = [
  "AAPL", "MSFT", "NVDA", "AMD", "GOOGL", "AMZN", "META",
  "TSLA", "PLTR", "AVGO", "NFLX", "SPY", "VOO", "QQQ",
];

export function onRequestGet(context) {
  const token = context.env.FINNHUB_API_KEY;
  if (!token) {
    return Response.json({ error: "FINNHUB_API_KEY is not set" }, { status: 500 });
  }

  // Cache for 60s: every visitor in that window shares ONE upstream fetch.
  return cachedJson(context, 60, async () => {
    try {
      const quotes = await Promise.all(
        SYMBOLS.map(async (sym) => {
          const r = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${token}`
          );
          if (!r.ok) return null;
          const q = await r.json();
          // q.c = current price, q.dp = percent change. Skip empty/closed symbols.
          if (typeof q.c !== "number" || q.c === 0) return null;
          return { sym, price: q.c, pct: typeof q.dp === "number" ? q.dp : 0 };
        })
      );
      return { status: 200, body: { quotes: quotes.filter(Boolean), ts: Date.now() } };
    } catch (err) {
      return { status: 502, body: { error: "Upstream quote fetch failed" } };
    }
  });
}
