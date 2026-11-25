const { getDb } = require("./_firebase");
const { hashPin, verifyPin, generateToken, verifyToken, recordAuditLog } = require("./_utils");

// Helper to calculate statistics from events collection
async function getCardStats(db, cardId) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Start of current week (Monday)
  const d = new Date(now);
  const day = d.getDay();
  const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(d.setDate(diffToMon));
  startOfWeek.setHours(0, 0, 0, 0);

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch all events for this card
  let query = db.collection("events");
  if (cardId) {
    query = query.where("cardId", "==", cardId);
  }
  const snap = await query.get();

  let tapsToday = 0;
  let tapsThisWeek = 0;
  let tapsThisMonth = 0;
  let tapsAllTime = 0;
  let redirectsToday = 0;
  let redirectsThisWeek = 0;
  let redirectsThisMonth = 0;
  let redirectsAllTime = 0;

  // Chart daily aggregates for last 7 days
  const dailyStats = {};
  for (let i = 6; i >= 0; i--) {
    const past = new Date();
    past.setDate(past.getDate() - i);
    const k = past.toISOString().split("T")[0];
    dailyStats[k] = { date: k, taps: 0, redirects: 0 };
  }

  snap.forEach(doc => {
    const data = doc.data();
    const type = data.eventType;
    const ts = new Date(data.timestamp);
    const dateStr = data.date || ts.toISOString().split("T")[0];

    const isTap = type === "tap";
    const isRedirect = type === "redirect";

    if (isTap) tapsAllTime++;
    if (isRedirect) redirectsAllTime++;

    if (dailyStats[dateStr]) {
      if (isTap) dailyStats[dateStr].taps++;
      if (isRedirect) dailyStats[dateStr].redirects++;
    }

    if (dateStr === todayStr) {
      if (isTap) tapsToday++;
      if (isRedirect) redirectsToday++;
    }
    if (ts >= startOfWeek) {
      if (isTap) tapsThisWeek++;
      if (isRedirect) redirectsThisWeek++;
    }
    if (ts >= startOfMonth) {
      if (isTap) tapsThisMonth++;
      if (isRedirect) redirectsThisMonth++;
    }
  });

  return {
    tapsToday,
    tapsThisWeek,
    tapsThisMonth,
    tapsAllTime,
    redirectsToday,
    redirectsThisWeek,
    redirectsThisMonth,
    redirectsAllTime,
    dailyChart: Object.values(dailyStats)
  };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const action = (req.query.action || parsedUrl.searchParams.get("action") || "").trim();

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const db = getDb();

  // 1. LOGIN (ID Kartu + PIN)
  if (action === "login") {
    if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });
    const cardId = (body.cardId || "").trim().toUpperCase();
    const pin = (body.pin || "").trim();

    if (!cardId || !pin) {
      return res.status(400).json({ success: false, error: "ID Kartu dan PIN wajib diisi!" });
    }

    try {
      const cardRef = db.collection("cards").doc(cardId);
      const snap = await cardRef.get();

      if (!snap.exists) {
        return res.status(404).json({ success: false, error: "Kartu tidak ditemukan di sistem." });
      }

      const card = snap.data();
      if (!card.active) {
        return res.status(400).json({ success: false, error: "Kartu ini belum diaktivasi. Silakan aktivasi terlebih dahulu dengan scan kartu." });
      }

      const isMatch = verifyPin(pin, card.pin);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: "PIN yang dimasukkan salah!" });
      }

      // Upgrade plaintext PIN to secure hash if not yet hashed
      if (card.pin && String(card.pin).length <= 6) {
        await cardRef.update({ pin: hashPin(pin) });
      }

      const token = generateToken({ cardId, role: "owner" });

      return res.json({
        success: true,
        token,
        card: {
          id: cardId,
          shopName: card.shopName || card.businessName || "",
          destination: card.destination || "",
          address: card.address || "",
          active: card.active,
          activatedAt: card.activatedAt || null
        }
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Auth Middleware for owner actions
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const session = verifyToken(token);

  if (!session || !session.cardId || session.role !== "owner") {
    return res.status(401).json({ success: false, error: "Sesi login tidak valid atau sudah kedaluwarsa (24 jam). Silakan login kembali." });
  }

  const cardId = session.cardId;
  const cardRef = db.collection("cards").doc(cardId);

  // 2. GET CARD INFO & STATISTICS
  if (action === "get-data" || req.method === "GET") {
    try {
      const snap = await cardRef.get();
      if (!snap.exists) {
        return res.status(404).json({ success: false, error: "Kartu tidak ditemukan." });
      }
      const card = snap.data();
      const stats = await getCardStats(db, cardId);

      return res.json({
        success: true,
        card: {
          id: cardId,
          shopName: card.shopName || card.businessName || "",
          destination: card.destination || "",
          address: card.address || "",
          active: card.active,
          activatedAt: card.activatedAt || null,
          updatedAt: card.updatedAt || null
        },
        stats
      });
    } catch (err) {
      console.error("Get data error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. RESET / UPDATE DESTINATION URL
  if (action === "update-destination") {
    if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });
    const newDestination = (body.destination || "").trim();

    if (!newDestination || (!newDestination.startsWith("http://") && !newDestination.startsWith("https://"))) {
      return res.status(400).json({ success: false, error: "URL tujuan ulasan tidak valid! Harus diawali http:// atau https://" });
    }

    try {
      const snap = await cardRef.get();
      const card = snap.data() || {};
      const oldDestination = card.destination || "";

      await cardRef.update({
        destination: newDestination,
        updatedAt: new Date().toISOString()
      });

      await recordAuditLog(db, {
        actionType: "CHANGE_URL",
        cardId,
        shopName: card.shopName || "",
        actor: `Owner (${cardId})`,
        details: `Mengubah URL tujuan ulasan dari "${oldDestination}" menjadi "${newDestination}"`
      });

      return res.json({ success: true, message: "URL tujuan ulasan berhasil diperbarui!", destination: newDestination });
    } catch (err) {
      console.error("Update destination error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. GANTI PIN
  if (action === "change-pin") {
    if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });
    const oldPin = (body.oldPin || "").trim();
    const newPin = (body.newPin || "").trim();
    const confirmPin = (body.confirmPin || "").trim();

    if (!oldPin || !newPin || !confirmPin) {
      return res.status(400).json({ success: false, error: "Semua kolom PIN harus diisi!" });
    }
    if (newPin !== confirmPin) {
      return res.status(400).json({ success: false, error: "Konfirmasi PIN baru tidak cocok!" });
    }
    if (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
      return res.status(400).json({ success: false, error: "PIN baru harus berupa 4-6 angka!" });
    }

    try {
      const snap = await cardRef.get();
      const card = snap.data() || {};

      if (!verifyPin(oldPin, card.pin)) {
        return res.status(400).json({ success: false, error: "PIN lama yang Anda masukkan salah!" });
      }

      const hashed = hashPin(newPin);
      await cardRef.update({
        pin: hashed,
        updatedAt: new Date().toISOString()
      });

      await recordAuditLog(db, {
        actionType: "CHANGE_PIN",
        cardId,
        shopName: card.shopName || "",
        actor: `Owner (${cardId})`,
        details: `Berhasil memperbarui PIN pengaman kartu`
      });

      return res.json({ success: true, message: "PIN kartu berhasil diubah!" });
    } catch (err) {
      console.error("Change pin error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(400).json({ success: false, error: "Action tidak dikenal" });
};
