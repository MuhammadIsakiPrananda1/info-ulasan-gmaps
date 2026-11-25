const crypto = require("crypto");

// Hash PIN with SHA-256 + salt
function hashPin(pin) {
  const salt = "ulasankuu_pin_salt_v1";
  return crypto.createHash("sha256").update(salt + String(pin).trim()).digest("hex");
}

function verifyPin(enteredPin, storedPinOrHash) {
  if (!storedPinOrHash) return false;
  const trimmed = String(enteredPin).trim();
  // Check hashed match
  if (hashPin(trimmed) === storedPinOrHash) return true;
  // Fallback for legacy plaintext 4-digit PINs
  if (trimmed === String(storedPinOrHash).trim()) return true;
  return false;
}

// Generate secure 24-hour session token
function generateToken(payload) {
  const secret = process.env.SESSION_SECRET || "ulasankuu_secret_key_session_24h_v1";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 86400; // 24 hours (1 day)
  const fullPayload = { ...payload, iat: now, exp };
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${payloadB64}`).digest("base64url");
  return `${header}.${payloadB64}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const secret = process.env.SESSION_SECRET || "ulasankuu_secret_key_session_24h_v1";
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac("sha256", secret).update(`${header}.${payloadB64}`).digest("base64url");
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null; // Expired (> 24h)
    return payload;
  } catch (e) {
    return null;
  }
}

// Helper to record audit log in Firestore
async function recordAuditLog(db, { actionType, cardId, shopName, actor, details, status = "success" }) {
  try {
    const logRef = db.collection("audit_logs").doc();
    const logData = {
      id: logRef.id,
      actionType, // e.g. "ACTIVATION", "CHANGE_URL", "CHANGE_PIN", "ADMIN_ACTION"
      cardId: cardId || null,
      shopName: shopName || null,
      actor: actor || "System", // "Owner: ABC123" or "Admin: username"
      details: details || "",
      status,
      timestamp: new Date().toISOString()
    };
    await logRef.set(logData);
    return logData;
  } catch (err) {
    console.error("Failed to record audit log:", err);
    return null;
  }
}

module.exports = {
  hashPin,
  verifyPin,
  generateToken,
  verifyToken,
  recordAuditLog
};
