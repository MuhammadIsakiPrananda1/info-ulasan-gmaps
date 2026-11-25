const fs = require('fs');

let html = fs.readFileSync('public/dashboard.html', 'utf8');

// 1. Bersihkan border border-[#f5b400]/30 dari menu 6, 7, 8
html = html.replace(/border border-\[#f5b400\]\/30/g, '');

// 2. Samakan styling semua link sidebar agar bersih & selaras tanpa outline kuning:
// Menu 1-5 sebelumnya:
// class="sb-nav-link group relative flex h-11 w-full items-center gap-3.5 rounded-[14px] px-3.5 text-[#5f5f5a] transition-all hover:bg-neutral-200/60 hover:text-[#141414] aria-[current=page]:bg-[#fff3c4] aria-[current=page]:text-[#141414] aria-[current=page]:font-bold cursor-pointer"
//
// Menu 6-8 sebelumnya:
// class="sb-nav-link group relative flex h-11 w-full items-center gap-3.5 rounded-[14px] px-3.5 text-[#5f5f5a] transition-all hover:bg-neutral-200/60 hover:text-[#141414] aria-[current=page]:bg-[#fff3c4] aria-[current=page]:text-[#a16d00] aria-[current=page]:font-bold cursor-pointer"
// dan SVG iconnya group-aria-[current=page]:text-amber-700
//
// Kita selaraskan semuanya ke:
// aria-[current=page]:bg-neutral-200/80 aria-[current=page]:text-[#141414] aria-[current=page]:font-bold (atau soft warm bg tanpa border)
// dan iconnya group-aria-[current=page]:text-[#141414]

// Kita ganti aria-[current=page]:bg-[#fff3c4] dan aria-[current=page]:text-[#a16d00] ke format bersih tanpa outline:
// Sesuai permintaan user: "tidak memakai outline kuning gitu dan pada gambar 2 itu kamu buatkan agar selaras tidak perlu kuning gitu cukup kayak lainnya gitu"
// Artinya tidak perlu ada outline/border kuning dan warnanya selaras seperti menu lainnya (bersih, teks #141414, background lembut netral / soft).

html = html.replace(/aria-\[current=page\]:text-\[#a16d00\]/g, 'aria-[current=page]:text-[#141414]');
html = html.replace(/group-aria-\[current=page\]:text-amber-700/g, 'group-aria-[current=page]:text-[#141414]');
html = html.replace(/group-aria-\[current=page\]:text-amber-600/g, 'group-aria-[current=page]:text-[#141414]');

// Pastikan aria-[current=page]:bg-[#fff3c4] menjadi highlight bersih selaras seperti menu di dashboard (misalnya hover:bg-neutral-200/60 dan active aria-[current=page]:bg-neutral-200/80 atau aria-[current=page]:bg-[#e8e6dc]/60 yang bersih tanpa outline)
html = html.replace(/aria-\[current=page\]:bg-\[#fff3c4\]/g, 'aria-[current=page]:bg-neutral-200/80');

fs.writeFileSync('public/dashboard.html', html, 'utf8');
console.log('✅ Sidebar links in dashboard.html updated cleanly without yellow outline!');
