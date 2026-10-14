// api/resolve-place.js - Simple version, no rate limit, no security
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const rawQuery = (req.query.q || "").trim();
  const query = rawQuery + " Indonesia";
  if (query.length < 5) return res.status(400).json({ success: false, error: "Query terlalu pendek" });

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
    console.error("resolve-place error:", e.message);
    res.status(500).json({ success: false, error: "Gagal resolve tempat" });
  }
};