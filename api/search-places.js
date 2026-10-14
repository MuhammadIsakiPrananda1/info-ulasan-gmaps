// api/search-places.js - dengan cache hemat kuota
const cache = new Map(); // key -> { expiry, payload }
const CACHE_TTL_MS = 7 * 24 * 3600 * 1000; // 7 hari, hasil tempat jarang berubah

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const rawQuery = (req.query.q || "").trim();
  if (rawQuery.length < 3) return res.json({ success: true, results: [] });
  const query = rawQuery + " Indonesia";
  const cacheKey = rawQuery.toLowerCase();

  // 1. Serve dari cache tanpa bakar kuota Google
  const hit = cache.get(cacheKey);
  if (hit && Date.now() < hit.expiry) {
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
    res.setHeader("X-Cache", "HIT");
    return res.json(hit.payload);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_PLACES_API_KEY not set");
    return res.status(500).json({ success: false, error: "Server config error" });
  }

  try {
    const url = `https://places.googleapis.com/v1/places:searchText`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id,places.location"
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "id",
        regionCode: "ID",
        maxResultCount: 15
      })
    });

    const data = await response.json();

    // Jangan samarkan error Google jadi results:[] — teruskan agar bisa didiagnosa
    if (!response.ok) {
      console.error("search-places google error:", response.status, JSON.stringify(data).slice(0, 500));
      res.setHeader("Cache-Control", "no-store");
      // 429 = kuota habis, jangan di-cache
      return res.status(response.status).json({
        success: false,
        error: data?.error?.message || "Google Places error",
        results: []
      });
    }
    if (!data.places) {
      // Sukses tapi kosong — kemungkinan bisnis memang tidak ketemu di Google
      console.log(`search-places empty for query: "${query}"`);
      return res.json({ success: true, results: [] });
    }

    const results = data.places.map(place => ({
      name: place.displayName?.text?.toUpperCase() || "",
      address: place.formattedAddress || "Indonesia",
      placeId: place.id || null,
      reviewUrl: place.id ? `https://search.google.com/local/writereview?placeid=${place.id}&hl=id` : null
    }));

    const payload = { success: true, results };
    // Simpan sukses ke cache + izinkan CDN cache (hemat kuota)
    if (cache.size > 500) cache.clear();
    cache.set(cacheKey, { expiry: Date.now() + CACHE_TTL_MS, payload });
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
    res.setHeader("X-Cache", "MISS");
    res.json(payload);
  } catch (e) {
    console.error("search-places error:", e.message);
    res.status(500).json({ success: false, error: "Gagal mencari tempat", results: [] });
  }
};