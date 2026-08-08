// ============================================================
//  /api/quotes  —  live stock quotes for the Research ticker.
//
//  Runs SERVER-SIDE on Vercel so the API key never touches the
//  browser. The page only ever fetches same-origin /api/quotes,
//  so the site's strict Content-Security-Policy stays unchanged.
//
//  Setup (one time):
//    1. Get a free token at https://finnhub.io  (real-time US stocks).
//    2. Vercel > Project > Settings > Environment Variables:
//         FINNHUB_API_KEY = <your token>
//    3. Redeploy.
// ============================================================

// Edit this watchlist to whatever you want the ticker to track.
const SYMBOLS = [
  "AAPL", "MSFT", "NVDA", "AMD", "GOOGL", "AMZN", "META",
  "TSLA", "PLTR", "AVGO", "NFLX", "SPY", "VOO", "QQQ",
];

export default async function handler(req, res) {
  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    res.status(500).json({ error: "FINNHUB_API_KEY is not set" });
    return;
  }

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
        return {
          sym,
          price: q.c,
          pct: typeof q.dp === "number" ? q.dp : 0,
        };
      })
    );

    const data = quotes.filter(Boolean);

    // Cache at Vercel's edge: every visitor in a 60s window shares ONE upstream
    // fetch, which keeps us comfortably under the API's rate limit.
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    res.status(200).json({ quotes: data, ts: Date.now() });
  } catch (err) {
    res.status(502).json({ error: "Upstream quote fetch failed" });
  }
}
