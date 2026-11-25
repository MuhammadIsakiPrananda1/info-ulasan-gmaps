const fs = require('fs');

let dash = fs.readFileSync('public/dashboard.html', 'utf8');

// 1. Sidebar menu icons & active states (remove all blue from sidebar buttons)
dash = dash.replace(/aria-\[current=page\]:bg-blue-50\/80/g, 'aria-[current=page]:bg-[#fff3c4]');
dash = dash.replace(/aria-\[current=page\]:bg-blue-50/g, 'aria-[current=page]:bg-[#fff3c4]');
dash = dash.replace(/aria-\[current=page\]:text-blue-600/g, 'aria-[current=page]:text-[#141414]');
dash = dash.replace(/group-aria-\[current=page\]:text-blue-600/g, 'group-aria-[current=page]:text-[#f5b400]');

// 2. Buttons in modals and forms:
dash = dash.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-[#f5b400] hover:bg-[#e0a400] text-[#141414]');
dash = dash.replace(/bg-blue-600/g, 'bg-[#f5b400] text-[#141414]');
dash = dash.replace(/hover:bg-blue-700/g, 'hover:bg-[#e0a400]');
dash = dash.replace(/text-blue-600/g, 'text-[#a16d00]');
dash = dash.replace(/text-blue-700/g, 'text-[#a16d00]');
dash = dash.replace(/text-blue-800/g, 'text-[#78350f]');
dash = dash.replace(/text-blue-900/g, 'text-[#141414]');
dash = dash.replace(/bg-blue-50/g, 'bg-[#fff3c4]');
dash = dash.replace(/bg-blue-100/g, 'bg-[#fef3c7]');
dash = dash.replace(/border-blue-200/g, 'border-[#f5b400]/40');
dash = dash.replace(/border-blue-600/g, 'border-[#f5b400]');
dash = dash.replace(/ring-blue-600/g, 'ring-[#f5b400]');
dash = dash.replace(/ring-blue-500/g, 'ring-[#f5b400]');

// Canvas QR detection overlay box in template preview
dash = dash.replace(/ctx\.strokeStyle = "#2563eb";/g, 'ctx.strokeStyle = "#f5b400";');
dash = dash.replace(/ctx\.fillStyle = "#2563eb";/g, 'ctx.fillStyle = "#f5b400";');

// In case any lingering #2563eb
dash = dash.replace(/#2563eb/g, '#f5b400');

fs.writeFileSync('public/dashboard.html', dash, 'utf8');
console.log('✅ public/dashboard.html: All blue elements replaced with Yellow & White!');
