const fs = require('fs');
const d = fs.readFileSync('public/dashboard.html', 'utf8');
const lines = d.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('id="view-cards"')) {
    console.log('Found view-cards at line ' + (idx + 1));
    for (let j = idx; j < idx + 70; j++) {
      console.log((j + 1) + ': ' + lines[j]);
    }
  }
});
