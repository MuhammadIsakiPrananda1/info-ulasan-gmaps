const functions = require("firebase-functions");
const fetch = require("node-fetch");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// ===== SEARCH PLACES =====
exports.searchPlaces = functions.https.onRequest(async (req, res) => {
    if (req.method === "OPTIONS") { res.status(204).set(corsHeaders).send(""); return; }
    res.set(corsHeaders);

    const query = (req.query.q || "").trim() + " Indonesia";
    if (query.length < 3) { res.json({ success: true, results: [] }); return; }

    try {
        const url = `https://www.google.com/search?tbm=map&hl=id&gl=id&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "id-ID,id;q=0.9"
            }
        });
        const text = await response.text();

        const results = [];
        const seenPlaceIds = new Set();
        const seenNames = new Set();
        const jsonStr = text.replace(/^\)\]\}'/, "").trim();

        try {
            const data = JSON.parse(jsonStr);
            const parseGoogleResults = (arr) => {
                if (!Array.isArray(arr)) return;
                for (const item of arr) {
                    if (!Array.isArray(item)) continue;
                    if (item[14]) {
                        const name = item[14][11];
                        const address = Array.isArray(item[14][2]) ? item[14][2].filter(Boolean).join(", ") : "";
                        const placeMatch = JSON.stringify(item).match(/ChIJ[a-zA-Z0-9_-]{23,35}/);
                        const placeId = placeMatch ? placeMatch[0] : null;
                        if (name && placeId && !seenPlaceIds.has(placeId)) {
                            seenPlaceIds.add(placeId);
                            seenNames.add(name.toLowerCase());
                            results.push({
                                name: name.toUpperCase(),
                                address: address || "Indonesia",
                                placeId,
                                reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}&hl=id`
                            });
                        }
                    }
                    if (item.length > 14) parseGoogleResults(item);
                }
            };
            if (data[0] && Array.isArray(data[0][1])) parseGoogleResults(data[0][1]);
            if (data[1] && Array.isArray(data[1])) parseGoogleResults(data[1]);
            if (data[3] && Array.isArray(data[3])) parseGoogleResults(data[3]);
        } catch (_) { }

        // Extract all place IDs from raw text
        const allPlaceIds = [...text.matchAll(/ChIJ[a-zA-Z0-9_-]{23,35}/g)].map(m => m[0]);
        for (const placeId of allPlaceIds) {
            if (!seenPlaceIds.has(placeId)) {
                seenPlaceIds.add(placeId);
                const idx = text.indexOf(placeId);
                const context = text.substring(Math.max(0, idx - 500), idx + 500);
                const nameMatch = context.match(/\["([^"]{2,60})"/);
                const name = nameMatch ? nameMatch[1].toUpperCase() : query.toUpperCase().replace(" INDONESIA", "");
                results.push({ name, address: "Indonesia", placeId, reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}&hl=id` });
            }
        }

        res.json({ success: true, results: results.slice(0, 15) });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message, results: [] });
    }
});

// ===== RESOLVE PLACE =====
exports.resolvePlace = functions.https.onRequest(async (req, res) => {
    if (req.method === "OPTIONS") { res.status(204).set(corsHeaders).send(""); return; }
    res.set(corsHeaders);

    const query = (req.query.q || "").trim() + " Indonesia";
    try {
        const url = `https://www.google.com/search?tbm=map&hl=id&gl=id&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "id-ID,id;q=0.9"
            }
        });
        const text = await response.text();
        const placeMatch = text.match(/ChIJ[a-zA-Z0-9_-]{23,35}/);
        const placeId = placeMatch ? placeMatch[0] : null;
        res.json({
            success: true,
            placeId,
            reviewUrl: placeId
                ? `https://search.google.com/local/writereview?placeid=${placeId}&hl=id`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});