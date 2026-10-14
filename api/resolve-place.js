// api/resolve-place.js - Secure with rate limiting & env-only API key
const RATE_LIMIT = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 menit
const RATE_LIMIT_MAX = 30; // 30 requests/menit per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimit = RATE_LIMIT.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  userLimit.count++;
  RATE_LIMIT.set(ip, userLimit);
  
  return userLimit.count <= RATE_LIMIT_MAX;
}

function sanitizeQuery(query) {
  return query.replace(/[<>\"'&;]/g, '').trim().slice(0, 100);
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    console.log(`[RATE_LIMIT] ${new Date().toISOString()} - ${ip} - resolve-place`);
    return res.status(429).json({ success: false, error: "Terlalu banyak permintaan. Coba lagi nanti." });
  }

  // Validate & sanitize query
  const rawQuery = (req.query.q || "").trim();
  const query = sanitizeQuery(rawQuery) + " Indonesia";
  if (query.length < 5) return res.status(400).json({ success: false, error: "Query terlalu pendek" });

  // API Key dari environment variable ONLY
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error(`[CONFIG_ERROR] GOOGLE_PLACES_API_KEY not set`);
    return res.status(500).json({ success: false, error: "Server configuration error" });
  }

  try {
    const url = `https://places.googleapis.com/v1/places:searchText`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id"
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "id",
        regionCode: "ID",
        maxResultCount: 1
      })
    });

    const data = await response.json();
    const placeId = data.places?.[0]?.id || null;

    res.json({
      success: true,
      placeId,
      reviewUrl: placeId
        ? `https://search.google.com/local/writereview?placeid=${placeId}&hl=id`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    });
  } catch (e) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${ip} - resolve-place - ${e.message}`);
    res.status(500).json({ success: false, error: "Gagal resolve tempat" });
  }
};