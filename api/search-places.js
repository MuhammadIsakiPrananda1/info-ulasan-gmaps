// api/search-places.js - bersih, Google Places New saja + cache
const cache = new Map();
const CACHE_TTL_MS = 30 * 24 * 3600 * 1000;

function getKeys() {
  return (process.env.GOOGLE_PLACES_API_KEY || "").split(",").map((s) => s.trim()).filter(Boolean);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const rawQuery = (req.query.q || "").trim();
  if (rawQuery.length < 5) return res.json({ success: true, results: [] });
  const query = rawQuery + " Indonesia";
  const cacheKey = rawQuery.toLowerCase();

  const hit = cache.get(cacheKey);
  if (hit && Date.now() < hit.expiry) {
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
    res.setHeader("X-Cache", "HIT");
    return res.json(hit.payload);
  }

  const keys = getKeys();
  if (!keys.length) {
    return res.status(500).json({ success: false, error: "Server config error", results: [] });
  }

  let lastError = "Google Places error";
  let lastStatus = 500;
  for (const apiKey of keys) {
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id",
        },
        body: JSON.stringify({ textQuery: query, languageCode: "id", regionCode: "ID", maxResultCount: 8 }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 429) {
        lastError = data?.error?.message || "Quota exceeded";
        lastStatus = 429;
        continue;
      }
      if (!response.ok) {
        lastError = data?.error?.message || "Google Places error";
        lastStatus = response.status;
        continue;
      }
      if (!data.places) return res.json({ success: true, results: [] });

      const results = data.places.map((p) => ({
        name: p.displayName?.text?.toUpperCase() || "",
        address: p.formattedAddress || "Indonesia",
        placeId: p.id || null,
        reviewUrl: p.id ? `https://search.google.com/local/writereview?placeid=${p.id}&hl=id` : null,
      }));

      const payload = { success: true, results };
      if (cache.size > 1000) cache.clear();
      cache.set(cacheKey, { expiry: Date.now() + CACHE_TTL_MS, payload });
      res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
      res.setHeader("X-Cache", "MISS");
      return res.json(payload);
    } catch (e) {
      lastError = e.message;
      lastStatus = 500;
      continue;
    }
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(lastStatus).json({ success: false, error: lastError, results: [] });
};
