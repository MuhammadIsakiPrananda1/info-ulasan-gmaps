const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Jalankan build.js untuk inject environment variabel Firebase jika ada .env
try {
  console.log('🔄 Menjalankan build.js...');
  execSync('node build.js', { stdio: 'inherit' });
} catch (e) {
  console.warn('⚠️ Gagal menjalankan build.js otomatis:', e.message);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Rewrites matching vercel.json & serve.json
  if (pathname === '/login') pathname = '/login.html';
  else if (pathname === '/admin') pathname = '/login.html';
  else if (pathname === '/dashboard') pathname = '/dashboard.html';
  else if (pathname === '/admin-dashboard') pathname = '/dashboard.html';
  else if (pathname === '/panel') pathname = '/panel.html';
  else if (pathname === '/pembeli') pathname = '/pembeli.html';
  else if (pathname === '/reseller') pathname = '/reseller.html';
  else if (pathname === '/cetak') pathname = '/cetak.html';
  else if (pathname === '/') pathname = '/pembeli.html';

  // Support local /api/* endpoints in development
  if (pathname.startsWith('/api/')) {
    const apiName = pathname.replace('/api/', '').split('?')[0];
    const apiPath = path.join(__dirname, 'api', `${apiName}.js`);
    if (fs.existsSync(apiPath)) {
      try {
        let bodyBuffer = [];
        req.on('data', chunk => bodyBuffer.push(chunk));
        req.on('end', () => {
          req.body = Buffer.concat(bodyBuffer).toString();
          req.query = Object.fromEntries(parsedUrl.searchParams.entries());
          res.status = (code) => { res.statusCode = code; return res; };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };
          res.set = (k, v) => {
            if (typeof k === 'object') {
              Object.entries(k).forEach(([key, val]) => res.setHeader(key, val));
            } else {
              res.setHeader(k, v);
            }
            return res;
          };
          res.send = (d) => res.end(d);
          try {
            delete require.cache[require.resolve(apiPath)];
            const handler = require(apiPath);
            handler(req, res);
          } catch (handlerErr) {
            console.error('API Handler Error:', handlerErr);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: handlerErr.message }));
          }
        });
        return;
      } catch (err) {
        console.error('Dev Server API error:', err);
      }
    }
  }

  let filePath = path.join(PUBLIC_DIR, pathname);

  // Cek apakah file ada secara fisik
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA fallback: jika bukan file statis bertipe ekstensi, arahkan ke index.html (untuk rute /{CARD_ID})
    const ext = path.extname(pathname);
    if (!ext) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Server Error: ' + err.message);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server Development berjalan di: http://localhost:${PORT}`);
  console.log(`📌 Dashboard Desain & QR:        http://localhost:${PORT}/dashboard`);
  console.log(`📌 Cetak QR:                      http://localhost:${PORT}/cetak`);
  console.log(`📌 Admin Dashboard:               http://localhost:${PORT}/admin-dashboard\n`);
});
