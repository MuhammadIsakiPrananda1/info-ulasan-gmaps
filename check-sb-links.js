const fs = require('fs');
const html = fs.readFileSync('public/dashboard.html', 'utf8');

const regex = /<button[^>]+class="[^"]*sb-nav-link[^"]*"[^>]*>/g;
const matches = html.match(regex);
if (matches) {
  matches.forEach((m, idx) => console.log((idx+1) + ': ' + m));
}
