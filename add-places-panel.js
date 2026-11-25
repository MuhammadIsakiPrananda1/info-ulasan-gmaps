const fs = require('fs');

let panel = fs.readFileSync('public/panel.html', 'utf8');

// 1. Perbarui Form Update Tujuan Review di public/panel.html agar ada input pencarian bisnis Google Maps dengan autocomplete dropdown seperti aktivasi
const oldDestForm = `<form id="formUpdateDestination" class="space-y-4">
              <div>
                <label for="currentDestInput" class="block text-xs font-bold text-[#2a2a28] mb-1">URL Tujuan Saat Ini</label>
                <input type="text" id="currentDestInput" readonly class="w-full text-xs font-mono px-3.5 py-2.5 bg-[#f4f4f0] border border-[#e8e6dc] rounded-[14px] text-[#5f5f5a] select-all focus:outline-none">
              </div>

              <div>
                <label for="newDestInput" class="block text-xs font-bold text-[#2a2a28] mb-1">URL Tujuan Review Baru</label>
                <input type="url" id="newDestInput" placeholder="https://search.google.com/local/writereview?placeid=..." required class="w-full text-xs font-mono px-3.5 py-2.5 bg-white border border-[#e8e6dc] rounded-[14px] text-[#141414] focus:outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-amber-500/20">
                <span class="text-[11px] text-slate-400 mt-1 block">Pastikan URL diawali https://</span>
              </div>

              <button type="submit" id="btnSaveDest" class="w-full py-3 px-4 rounded-[14px] bg-slate-900 hover:bg-[#f5b400] text-[#141414] text-white font-bold text-xs shadow-xs transition-colors">
                Simpan URL Baru
              </button>
            </form>`;

const newDestForm = `<form id="formUpdateDestination" class="space-y-4">
              <div>
                <label for="currentDestInput" class="block text-xs font-bold text-[#2a2a28] mb-1">URL Tujuan Saat Ini</label>
                <input type="text" id="currentDestInput" readonly class="w-full text-xs font-mono px-3.5 py-2.5 bg-[#f4f4f0] border border-[#e8e6dc] rounded-[14px] text-[#5f5f5a] select-all focus:outline-none">
              </div>

              <!-- PENCARIAN TEMPAT GOOGLE MAPS SEPERTI HALAMAN AKTIVASI -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="searchPlaceInput" class="block text-xs font-bold text-[#2a2a28]">Cari Bisnis di Google Maps (Otomatis)</label>
                  <span class="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">Direkomendasikan</span>
                </div>
                <div class="relative">
                  <input type="text" id="searchPlaceInput" placeholder="Ketik nama bisnis / cabang Google Maps..." autocomplete="off" class="w-full text-xs px-3.5 py-2.5 pr-9 bg-white border border-[#e8e6dc] rounded-[14px] text-[#141414] focus:outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-amber-500/20">
                  <span id="placesSearchSpinner" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-xs animate-spin">⚪</span>
                  <div id="placesSuggestionsBox" class="hidden absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto bg-white border border-[#e8e6dc] rounded-[14px] shadow-lg z-50 divide-y divide-neutral-100"></div>
                </div>
                <span class="text-[11px] text-[#5f5f5a] mt-1 block">Pilih nama toko dari daftar rekomendasi agar link ulasan otomatis terisi.</span>
              </div>

              <div>
                <label for="newDestInput" class="block text-xs font-bold text-[#2a2a28] mb-1">Atau Tempel URL Tujuan Manual</label>
                <input type="url" id="newDestInput" placeholder="https://search.google.com/local/writereview?placeid=..." required class="w-full text-xs font-mono px-3.5 py-2.5 bg-white border border-[#e8e6dc] rounded-[14px] text-[#141414] focus:outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-amber-500/20">
                <span class="text-[11px] text-slate-400 mt-1 block">Pastikan URL diawali https://</span>
              </div>

              <button type="submit" id="btnSaveDest" class="w-full py-3 px-4 rounded-[14px] bg-[#f5b400] hover:bg-[#e0a400] text-[#141414] font-bold text-xs shadow-xs transition-colors cursor-pointer">
                Simpan URL Baru
              </button>
            </form>`;

if (panel.includes('id="formUpdateDestination"')) {
  panel = panel.replace(oldDestForm, newDestForm);
  console.log('✅ Form Update Destination in panel.html updated with Places Search');
}

// 2. Tambahkan logika Autocomplete Google Places di script panel.html
const oldScriptBeforeReset = 'const formResetDest = document.getElementById("formUpdateDestination");';

const newPlacesLogic = `
    // Logika Pencarian Bisnis Google Places di Panel (Seperti Halaman Aktivasi)
    const searchPlaceInput = document.getElementById("searchPlaceInput");
    const placesSearchSpinner = document.getElementById("placesSearchSpinner");
    const placesSuggestionsBox = document.getElementById("placesSuggestionsBox");
    let searchDebounceTimeout = null;
    let selectedShopNameFromSearch = null;

    if (searchPlaceInput) {
      searchPlaceInput.addEventListener("input", () => {
        const query = searchPlaceInput.value.trim();
        clearTimeout(searchDebounceTimeout);

        if (query.length < 3) {
          placesSuggestionsBox.classList.add("hidden");
          placesSuggestionsBox.innerHTML = "";
          placesSearchSpinner.classList.add("hidden");
          return;
        }

        searchDebounceTimeout = setTimeout(async () => {
          placesSearchSpinner.classList.remove("hidden");
          try {
            const res = await fetch(\`/api/search-places?q=\${encodeURIComponent(query)}\`);
            const data = await res.json();
            placesSearchSpinner.classList.add("hidden");

            if (data.success && Array.isArray(data.results) && data.results.length > 0) {
              placesSuggestionsBox.innerHTML = data.results.map((item, idx) => \`
                <div class="place-suggestion-item p-3 hover:bg-[#fafaf7] cursor-pointer transition-colors" data-idx="\${idx}">
                  <div class="font-bold text-xs text-[#141414]">\${item.name || ''}</div>
                  <div class="text-[11px] text-[#5f5f5a] truncate mt-0.5">\${item.address || ''}</div>
                </div>
              \`).join("");

              // Event listener klik suggestion
              placesSuggestionsBox.querySelectorAll(".place-suggestion-item").forEach(el => {
                el.addEventListener("click", () => {
                  const item = data.results[Number(el.dataset.idx)];
                  searchPlaceInput.value = item.name;
                  selectedShopNameFromSearch = item.name;
                  const newDestInput = document.getElementById("newDestInput");
                  if (newDestInput) {
                    newDestInput.value = item.reviewUrl || \`https://search.google.com/local/writereview?placeid=\${item.placeId}\`;
                  }
                  placesSuggestionsBox.classList.add("hidden");
                });
              });
              placesSuggestionsBox.classList.remove("hidden");
            } else {
              placesSuggestionsBox.innerHTML = \`<div class="p-3 text-xs text-[#8c8c84]">Tidak ditemukan di Google Maps. Anda dapat mengetik URL secara manual di bawah.</div>\`;
              placesSuggestionsBox.classList.remove("hidden");
            }
          } catch (err) {
            console.warn("Gagal mencari tempat via Google Places:", err);
            placesSearchSpinner.classList.add("hidden");
            placesSuggestionsBox.classList.add("hidden");
          }
        }, 500);
      });

      // Tutup dropdown jika klik di luar
      document.addEventListener("click", (e) => {
        if (!searchPlaceInput.contains(e.target) && !placesSuggestionsBox.contains(e.target)) {
          placesSuggestionsBox.classList.add("hidden");
        }
      });
    }

    const formResetDest = document.getElementById("formUpdateDestination");`;

if (panel.includes(oldScriptBeforeReset)) {
  panel = panel.replace(oldScriptBeforeReset, newPlacesLogic);
  console.log('✅ Added Google Places search logic to public/panel.html');
}

// 3. Tambahkan update nama bisnis jika dipilih dari pencarian maps
const oldUpdateDocLogic = `        await updateDoc(cardRef, {
          destination: newDestination,
          placeId: newDestination,
          url: newDestination,
          updatedAt: new Date().toISOString()
        });`;

const newUpdateDocLogic = `        const updates = {
          destination: newDestination,
          placeId: newDestination,
          url: newDestination,
          updatedAt: new Date().toISOString()
        };
        if (selectedShopNameFromSearch) {
          updates.shopName = selectedShopNameFromSearch;
          updates.businessName = selectedShopNameFromSearch;
        }
        await updateDoc(cardRef, updates);`;

if (panel.includes(oldUpdateDocLogic)) {
  panel = panel.replace(oldUpdateDocLogic, newUpdateDocLogic);
}

fs.writeFileSync('public/panel.html', panel, 'utf8');
console.log('✅ public/panel.html updated successfully with places search & selection!');
