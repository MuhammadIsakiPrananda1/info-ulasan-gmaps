const { getDb } = require("./_firebase");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }
  body = body || {};

  const cardId = (body.cardId || "").trim().toUpperCase();
  const eventType = (body.eventType || "").trim().toLowerCase(); // "tap" or "redirect"

  if (!cardId || !["tap", "redirect"].includes(eventType)) {
    return res.status(400).json({ success: false, error: "Invalid cardId or eventType" });
  }

  try {
    const db = getDb();
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const isoString = now.toISOString();

    const eventRef = db.collection("events").doc();
    await eventRef.set({
      id: eventRef.id,
      cardId,
      eventType,
      date: dateStr,
      timestamp: isoString,
      userAgent: req.headers["user-agent"] || "",
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || ""
    });

    return res.json({ success: true, recorded: eventType, cardId });
  } catch (err) {
    console.error("Error in api/track:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
