const fs = require('fs');
const lines = fs.readFileSync('public/dashboard.html', 'utf8').split('\n');

lines.forEach((l, idx) => {
  if (l.match(/blue-[0-9]+|#2563eb/i)) {
    console.log((idx+1) + ': ' + l.trim().substring(0, 100));
  }
});
