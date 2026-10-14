// api/admin-verify.js - Verify admin password (server-side, password never exposed to client)
const crypto = require("crypto");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) {
    console.error("ADMIN_PASSWORD not set");
    return res.status(500).json({ success: false, error: "Server config error" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  const input = (body && body.password) || "";

  const a = Buffer.from(String(input));
  const b = Buffer.from(String(adminPw));
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) return res.status(401).json({ success: false });
  return res.json({ success: true });
};
