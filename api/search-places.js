// api/search-places.js - Simple version, no rate limit, no security
module.exports = async (req, res) => {
  // CORS + no-cache (cegah 304 Not Modified berisi hasil kosong cache)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  if (req.method === "OPTIONS") return res.status(204).end();

  const rawQuery = (req.query.q || "").trim();
  const query = rawQuery + " Indonesia";
  if (query.length < 5) return res.json({ success: true, results: [] });

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

    res.json({ success: true, results });
  } catch (e) {
    console.error("search-places error:", e.message);
    res.status(500).json({ success: false, error: "Gagal mencari tempat", results: [] });
  }
};