const fs = require('fs');
const html = fs.readFileSync('public/dashboard.html', 'utf8');

const matches = html.match(/<style>([\s\S]*?)<\/style>/g);
if (matches) {
  matches.forEach(m => {
    const lines = m.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('sb-nav-link') || l.includes('aria-current') || l.includes('outline')) {
        console.log((idx+1) + ': ' + l.trim());
      }
    });
  });
}
