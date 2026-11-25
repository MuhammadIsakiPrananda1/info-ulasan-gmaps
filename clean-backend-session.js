const fs = require('fs');

// 1. Update api/_utils.js agar token pemilik kartu (role: "owner") bersifat permanen (tanpa batas expired 24 jam)
let utils = fs.readFileSync('api/_utils.js', 'utf8');

const oldGenToken = `function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 86400; // 24 hours (1 day)
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(\`\${header}.\${body}\`).digest("base64url");
  return \`\${header}.\${body}.\${signature}\`;
}`;

const newGenToken = `function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  // Pemilik kartu panel bersifat permanen tanpa kedaluwarsa, admin tetap 24 jam
  const exp = payload.role === "owner" ? (now + (100 * 365 * 86400)) : (now + 86400);
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(\`\${header}.\${body}\`).digest("base64url");
  return \`\${header}.\${body}.\${signature}\`;
}`;

utils = utils.replace(oldGenToken, newGenToken);
fs.writeFileSync('api/_utils.js', utils, 'utf8');
console.log('✅ Updated api/_utils.js token generator for permanent owner session');

// 2. Update api/panel.js agar pesan error bersih tanpa menyebut 24 jam
let apiPanel = fs.readFileSync('api/panel.js', 'utf8');
apiPanel = apiPanel.replace(
  'return res.status(401).json({ success: false, error: "Sesi login tidak valid atau sudah kedaluwarsa (24 jam). Silakan login kembali." });',
  'return res.status(401).json({ success: false, error: "Sesi login tidak valid. Silakan login kembali." });'
);
fs.writeFileSync('api/panel.js', apiPanel, 'utf8');
console.log('✅ Cleaned api/panel.js error messages');
