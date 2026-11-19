// Shared helpers for the Pages Functions in functions/api/.

// Serve a JSON response from Cloudflare's edge cache when we have a fresh copy,
// otherwise build it and store it for `ttl` seconds. Every visitor in that
// window shares one upstream request, which keeps the free API limits safe.
// (Vercel did this with s-maxage; Pages Functions need the Cache API instead.)
export async function cachedJson(context, ttl, build) {
  const cache = caches.default;
  const key = new Request(new URL(context.request.url).origin + new URL(context.request.url).pathname);

  const hit = await cache.match(key);
  if (hit) return hit;

  const { status, body } = await build();
  const res = new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status === 200 ? `public, max-age=${ttl}` : "no-store",
    },
  });
  if (status === 200) context.waitUntil(cache.put(key, res.clone()));
  return res;
}
