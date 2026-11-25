const fs = require('fs');

let dash = fs.readFileSync('public/dashboard.html', 'utf8');

const startMarker = 'async function loadAuditLogs() {';
const endMarker = 'function renderAuditLogsTable() {';

const startIndex = dash.indexOf(startMarker);
const endIndex = dash.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newLoadAuditLogs = `async function loadAuditLogs() {
  const tbody = document.getElementById("auditLogsTableBody");
  if (!tbody) return;
  tbody.innerHTML = \`<tr><td colspan="6" class="p-6 text-center text-[#8c8c84] font-medium">Memuat audit log...</td></tr>\`;

  // Langsung gunakan Firebase Client SDK (tidak perlu serverless API)
  try {
    const snap = await getDocs(collection(db, "audit_logs"));
    const logs = [];
    snap.forEach(d => logs.push({ id: d.id, ...d.data() }));
    logs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    allAuditLogsList = logs;
    renderAuditLogsTable();
  } catch (fsErr) {
    console.warn("Audit logs query:", fsErr);
    allAuditLogsList = [];
    tbody.innerHTML = \`<tr><td colspan="6" class="p-6 text-center text-[#8c8c84] font-medium">Belum ada riwayat aktivitas audit log yang tercatat.</td></tr>\`;
  }
}

`;

  dash = dash.substring(0, startIndex) + newLoadAuditLogs + dash.substring(endIndex);
  fs.writeFileSync('public/dashboard.html', dash, 'utf8');
  console.log('✅ loadAuditLogs updated to direct client SDK in dashboard.html');
}
