const fs = require('fs');

let panel = fs.readFileSync('public/panel.html', 'utf8');

// 1. Hapus teks "Sesi login tersimpan aman selama 24 jam di browser ini." di form login
panel = panel.replace(
  '<p class="text-[11px] text-slate-400 mt-1.5">Sesi login tersimpan aman selama 24 jam di browser ini.</p>',
  ''
);

// 2. Ubah getSession() agar tidak mengecek batasan 24 jam (sesi tetap ada sampai pengguna logout)
const oldGetSession = `    function getSession() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        // Validasi expired 24 jam (86400 detik)
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }`;

const newGetSession = `    function getSession() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }`;

if (panel.includes('// Validasi expired 24 jam (86400 detik)')) {
  panel = panel.replace(oldGetSession, newGetSession);
}

// 3. Ubah setSession() agar tidak menyertakan expiresAt 24 jam
panel = panel.replace(
  /expiresAt:\s*Date\.now\(\)\s*\+\s*\(24\s*\*\s*60\s*\*\s*60\s*\*\s*1000\)[^\n]*/g,
  ''
);

// 4. Hapus alert kadaluarsa 24 jam di loadOwnerData error handling
panel = panel.replace(
  'alert("Sesi Anda telah berakhir (24 jam). Silakan login kembali.");',
  '// Sesi dibersihkan saat error memuat'
);

fs.writeFileSync('public/panel.html', panel, 'utf8');
console.log('✅ Removed 24-hour session limit and hint text from public/panel.html');
