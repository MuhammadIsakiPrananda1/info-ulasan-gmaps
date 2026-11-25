const { getDb } = require("./_firebase");
const { recordAuditLog } = require("./_utils");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  const db = getDb();

  // GET: Fetch audit logs with filtering and search
  if (req.method === "GET") {
    try {
      const snap = await db.collection("audit_logs").orderBy("timestamp", "desc").limit(200).get();
      const logs = [];
      snap.forEach(doc => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      return res.json({ success: true, logs });
    } catch (err) {
      console.error("Error reading audit logs:", err);
      // If collection doesn't have index yet, try without orderBy
      try {
        const snap = await db.collection("audit_logs").limit(200).get();
        const logs = [];
        snap.forEach(doc => logs.push({ id: doc.id, ...doc.data() }));
        logs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        return res.json({ success: true, logs });
      } catch (err2) {
        return res.status(500).json({ success: false, error: err2.message, logs: [] });
      }
    }
  }

  // POST: Record an audit log from client/admin
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    body = body || {};

    const { actionType, cardId, shopName, actor, details, status } = body;
    const logData = await recordAuditLog(db, {
      actionType: actionType || "ADMIN_ACTION",
      cardId: cardId || null,
      shopName: shopName || null,
      actor: actor || "Admin",
      details: details || "",
      status: status || "success"
    });

    if (logData) {
      return res.json({ success: true, log: logData });
    } else {
      return res.status(500).json({ success: false, error: "Gagal menyimpan audit log" });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
};
