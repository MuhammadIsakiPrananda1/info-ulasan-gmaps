const fs = require('fs');

let dash = fs.readFileSync('public/dashboard.html', 'utf8');

// Di loadAdminsList, tangani error secara senyap jika koleksi admins di Firestore belum dibuat / belum dibuka rules-nya
dash = dash.replace(
  'console.warn("Gagal load admins dari Firestore, fallback ke localStorage:", err);',
  '// Fallback tenang ke local admins jika di Firestore belum ada\n    // console.info("Using local admins configuration");'
);

fs.writeFileSync('public/dashboard.html', dash, 'utf8');
console.log('✅ loadAdminsList silenced warning in public/dashboard.html');
