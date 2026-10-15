// api/resolve-place.js - hemat kuota, cache + fallback Maps search URL
const cache = new Map();
const CACHE_TTL_MS = 30 * 24 * 3600 * 1000;

function getKeys() {
  return (process.env.GOOGLE_PLACES_API_KEY || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
  if (req.method === "OPTIONS") return res.status(204).end();

  const rawQuery = (req.query.q || "").trim();
  const query = rawQuery + " Indonesia";
  if (query.length < 7) return res.status(400).json({ success: false, error: "Query terlalu pendek" });

  const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const cacheKey = rawQuery.toLowerCase();

  const hit = cache.get(cacheKey);
  if (hit && Date.now() < hit.expiry) {
    res.setHeader("X-Cache", "HIT");
    return res.json(hit.payload);
  }

  const keys = getKeys();
  if (!keys.length) return res.json({ success: true, placeId: null, reviewUrl: fallbackUrl, fallback: true });

  for (const apiKey of keys) {
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id",
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: "id",
          regionCode: "ID",
          maxResultCount: 1,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 429) continue; // kuota key ini habis, coba key lain
      if (!response.ok) continue;

      const placeId = data.places?.[0]?.id || null;
      const payload = {
        success: true,
        placeId,
        reviewUrl: placeId
          ? `https://search.google.com/local/writereview?placeid=${placeId}&hl=id`
          : fallbackUrl,
      };
      if (cache.size > 1000) cache.clear();
      cache.set(cacheKey, { expiry: Date.now() + CACHE_TTL_MS, payload });
      return res.json(payload);
    } catch {
      continue;
    }
  }

  // Semua key gagal -> tetap 200 dengan link Maps biasa agar aktivasi tetap jalan
  return res.json({ success: true, placeId: null, reviewUrl: fallbackUrl, fallback: true });
};
