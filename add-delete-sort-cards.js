const fs = require('fs');

let dash = fs.readFileSync('public/dashboard.html', 'utf8');

// 1. Tambahkan Sortir dan Tombol Hapus Terpilih di toolbar atas tabel (view-cards)
const oldToolbarHeader = `<div class="sm:col-span-8">
              <div class="relative">
                <input type="text" id="inputSearchCards" placeholder="Cari ID kartu, nama bisnis, atau URL..." class="w-full rounded-[14px] border border-[#e8e6dc] bg-white pl-9 pr-3.5 py-2 text-xs text-[#141414] focus:border-[#f5b400] focus:outline-none">
                <svg class="size-4 text-[#8c8c84] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>
            <div class="sm:col-span-4">
              <select id="selectFilterCardStatus" class="w-full rounded-[14px] border border-[#e8e6dc] bg-white px-3 py-2 text-xs text-[#141414] focus:border-[#f5b400] focus:outline-none">
                <option value="ALL">Semua Status (Aktif & Belum)</option>
                <option value="ACTIVE">✓ Kartu Aktif Saja</option>
                <option value="INACTIVE">○ Kartu Belum Aktif Saja</option>
              </select>
            </div>`;

const newToolbarHeader = `<div class="sm:col-span-5">
              <div class="relative">
                <input type="text" id="inputSearchCards" placeholder="Cari ID kartu, nama bisnis, atau URL..." class="w-full rounded-[14px] border border-[#e8e6dc] bg-white pl-9 pr-3.5 py-2 text-xs text-[#141414] focus:border-[#f5b400] focus:outline-none">
                <svg class="size-4 text-[#8c8c84] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>
            <div class="sm:col-span-3">
              <select id="selectFilterCardStatus" class="w-full rounded-[14px] border border-[#e8e6dc] bg-white px-3 py-2 text-xs text-[#141414] focus:border-[#f5b400] focus:outline-none">
                <option value="ALL">Semua Status</option>
                <option value="ACTIVE">✓ Kartu Aktif</option>
                <option value="INACTIVE">○ Kartu Belum Aktif</option>
              </select>
            </div>
            <div class="sm:col-span-4 flex items-center gap-2">
              <select id="selectSortCards" class="w-full rounded-[14px] border border-[#e8e6dc] bg-white px-3 py-2 text-xs text-[#141414] focus:border-[#f5b400] focus:outline-none">
                <option value="NEWEST">Sortir: Terbaru Terdaftar</option>
                <option value="OLDEST">Sortir: Terlama Terdaftar</option>
                <option value="ID_ASC">Sortir: ID Kartu (A-Z)</option>
                <option value="NAME_ASC">Sortir: Nama Bisnis (A-Z)</option>
                <option value="STATUS_ACTIVE">Sortir: Kartu Aktif Duluan</option>
              </select>
              <button type="button" id="btnDeleteSelectedCards" disabled class="hidden items-center gap-1.5 rounded-[14px] bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-xs" title="Hapus kartu terpilih">
                <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                <span id="btnDeleteSelectedCount">Hapus</span>
              </button>
            </div>`;

if (dash.includes(oldToolbarHeader)) {
  dash = dash.replace(oldToolbarHeader, newToolbarHeader);
  console.log('✅ Updated card toolbar with Sort and Batch Delete button');
}

// 2. Tambahkan kolom checkbox Select All di <thead> tabel
const oldTableHead = `<thead class="bg-[#fafaf7] border-b border-[#e8e6dc] text-[#444440] font-bold">
                <tr>
                  <th class="p-3.5">ID Kartu</th>`;

const newTableHead = `<thead class="bg-[#fafaf7] border-b border-[#e8e6dc] text-[#444440] font-bold">
                <tr>
                  <th class="p-3.5 w-10 text-center">
                    <input type="checkbox" id="checkSelectAllCards" class="size-4 rounded border-[#e8e6dc] accent-neutral-950 cursor-pointer" title="Pilih Semua">
                  </th>
                  <th class="p-3.5">ID Kartu</th>`;

if (dash.includes(oldTableHead)) {
  dash = dash.replace(oldTableHead, newTableHead);
  console.log('✅ Added Select All checkbox to table header');
}

// 3. Update filterAndRenderCardsTable dan logic checkbox seleksi
const oldFilterRenderLogic = `var allFirestoreCardsList = [];
var cardsUnsubscribe = null;
let currentSearchQuery = "";
let currentFilterStatus = "ALL";

function filterAndRenderCardsTable() {
  const q = currentSearchQuery.toLowerCase();
  const filtered = allFirestoreCardsList.filter(card => {
    const id = (card.id || "").toLowerCase();
    const name = (card.shopName || card.businessName || card.placeName || "").toLowerCase();
    const dest = (card.destination || "").toLowerCase();
    const matchesSearch = !q || id.includes(q) || name.includes(q) || dest.includes(q);

    let matchesStatus = true;
    if (currentFilterStatus === "ACTIVE") matchesStatus = card.active === true;
    else if (currentFilterStatus === "INACTIVE") matchesStatus = card.active !== true;

    return matchesSearch && matchesStatus;
  });`;

const newFilterRenderLogic = `var allFirestoreCardsList = [];
var cardsUnsubscribe = null;
let currentSearchQuery = "";
let currentFilterStatus = "ALL";
let currentSortCards = "NEWEST";
const selectedCardsSet = new Set();

function updateSelectedCardsUI() {
  const btnDelete = document.getElementById("btnDeleteSelectedCards");
  const countLabel = document.getElementById("btnDeleteSelectedCount");
  const count = selectedCardsSet.size;

  if (btnDelete) {
    if (count > 0) {
      btnDelete.disabled = false;
      btnDelete.classList.remove("hidden");
      btnDelete.classList.add("inline-flex");
      if (countLabel) countLabel.textContent = \`Hapus (\${count})\`;
    } else {
      btnDelete.disabled = true;
      btnDelete.classList.add("hidden");
      btnDelete.classList.remove("inline-flex");
      if (countLabel) countLabel.textContent = "Hapus";
    }
  }

  // Checkbox Select All sync
  const checkAll = document.getElementById("checkSelectAllCards");
  if (checkAll) {
    const visibleCards = document.querySelectorAll(".card-row-checkbox");
    if (visibleCards.length > 0) {
      const allChecked = Array.from(visibleCards).every(cb => cb.checked);
      checkAll.checked = allChecked;
    } else {
      checkAll.checked = false;
    }
  }
}

function filterAndRenderCardsTable() {
  const q = currentSearchQuery.toLowerCase();
  let filtered = allFirestoreCardsList.filter(card => {
    const id = (card.id || "").toLowerCase();
    const name = (card.shopName || card.businessName || card.placeName || "").toLowerCase();
    const dest = (card.destination || "").toLowerCase();
    const matchesSearch = !q || id.includes(q) || name.includes(q) || dest.includes(q);

    let matchesStatus = true;
    if (currentFilterStatus === "ACTIVE") matchesStatus = card.active === true;
    else if (currentFilterStatus === "INACTIVE") matchesStatus = card.active !== true;

    return matchesSearch && matchesStatus;
  });

  // Sortir Kartu
  if (currentSortCards === "NEWEST") {
    filtered.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
  } else if (currentSortCards === "OLDEST") {
    filtered.sort((a, b) => new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0));
  } else if (currentSortCards === "ID_ASC") {
    filtered.sort((a, b) => (a.id || "").localeCompare(b.id || ""));
  } else if (currentSortCards === "NAME_ASC") {
    filtered.sort((a, b) => (a.shopName || a.businessName || "").localeCompare(b.shopName || b.businessName || ""));
  } else if (currentSortCards === "STATUS_ACTIVE") {
    filtered.sort((a, b) => (b.active === true ? 1 : 0) - (a.active === true ? 1 : 0));
  }`;

if (dash.includes('var allFirestoreCardsList = [];')) {
  dash = dash.replace(oldFilterRenderLogic, newFilterRenderLogic);
  console.log('✅ Updated filterAndRenderCardsTable logic with sorting and batch selection');
}

// 4. Tambahkan checkbox di setiap baris tabel desktop & kartu mobile
const oldRowDesktop = `<tr class="hover:bg-[#fafaf7]/70 transition-colors">
        <td class="p-3.5"><b class="font-mono tracking-wider font-bold text-[#141414]">\${id}</b></td>`;

const newRowDesktop = `<tr class="hover:bg-[#fafaf7]/70 transition-colors">
        <td class="p-3.5 text-center">
          <input type="checkbox" value="\${id}" class="card-row-checkbox size-4 rounded border-[#e8e6dc] accent-neutral-950 cursor-pointer" \${selectedCardsSet.has(id) ? 'checked' : ''}>
        </td>
        <td class="p-3.5"><b class="font-mono tracking-wider font-bold text-[#141414]">\${id}</b></td>`;

if (dash.includes(oldRowDesktop)) {
  dash = dash.replace(oldRowDesktop, newRowDesktop);
}

// Tambahkan tombol Hapus satuan di kolom Aksi
const oldActionCol = `<a href="\${card.url}" target="_blank" class="inline-flex items-center rounded-md border border-[#e8e6dc] bg-[#fafaf7] px-2.5 py-1 text-[11px] font-semibold text-[#2a2a28] hover:bg-[#f7f7f4]">Tes Link</a>`;

const newActionCol = `<div class="flex items-center justify-end gap-1.5">
            <a href="\${card.url}" target="_blank" class="inline-flex items-center rounded-md border border-[#e8e6dc] bg-[#fafaf7] px-2 py-1 text-[11px] font-semibold text-[#2a2a28] hover:bg-[#f7f7f4]">Tes Link</a>
            <button type="button" class="inline-flex items-center p-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" onclick="deleteSingleCard('\${id}')" title="Hapus Kartu \${id}">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>`;

if (dash.includes(oldActionCol)) {
  dash = dash.replace(oldActionCol, newActionCol);
}

// 5. Tambahkan Event Listener untuk Sortir, Select All, Checkbox individual, dan Hapus Kartu
const scriptInsertionMarker = '// Event Listener untuk Search & Filter NFC Cards';
const newEventHandlers = `// Event Listener untuk Sortir & Batch Hapus Kartu
const selectSortCards = document.getElementById("selectSortCards");
if (selectSortCards) {
  selectSortCards.addEventListener("change", (e) => {
    currentSortCards = e.target.value;
    filterAndRenderCardsTable();
  });
}

// Select All Checkbox
const checkSelectAllCards = document.getElementById("checkSelectAllCards");
if (checkSelectAllCards) {
  checkSelectAllCards.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    document.querySelectorAll(".card-row-checkbox").forEach(cb => {
      cb.checked = isChecked;
      if (isChecked) selectedCardsSet.add(cb.value);
      else selectedCardsSet.delete(cb.value);
    });
    updateSelectedCardsUI();
  });
}

// Delegasi klik checkbox individual
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("card-row-checkbox")) {
    const id = e.target.value;
    if (e.target.checked) selectedCardsSet.add(id);
    else selectedCardsSet.delete(id);
    updateSelectedCardsUI();
  }
});

// Fungsi Hapus Satu Kartu
window.deleteSingleCard = async function(cardId) {
  if (!confirm(\`Apakah Anda yakin ingin menghapus kartu \${cardId}? Tindakan ini tidak dapat dibatalkan.\`)) return;

  try {
    await deleteDoc(doc(db, "cards", cardId));
    selectedCardsSet.delete(cardId);
    updateSelectedCardsUI();
    // Audit log
    try {
      await addDoc(collection(db, "audit_logs"), {
        actionType: "DELETE_CARD",
        cardId: cardId,
        actor: "Admin",
        details: \`Menghapus kartu \${cardId}\`,
        timestamp: new Date().toISOString(),
        status: "success"
      });
    } catch(e){}
    alert(\`Kartu \${cardId} berhasil dihapus.\`);
  } catch (err) {
    console.error("Gagal menghapus kartu:", err);
    alert("Gagal menghapus kartu: " + err.message);
  }
};

// Tombol Hapus Semua Kartu Terpilih
const btnDeleteSelectedCards = document.getElementById("btnDeleteSelectedCards");
if (btnDeleteSelectedCards) {
  btnDeleteSelectedCards.addEventListener("click", async () => {
    const selectedIds = Array.from(selectedCardsSet);
    if (selectedIds.length === 0) return;

    if (!confirm(\`PERINGATAN: Apakah Anda yakin ingin menghapus \${selectedIds.length} kartu yang dipilih? Tindakan ini permanen.\`)) return;

    btnDeleteSelectedCards.disabled = true;
    btnDeleteSelectedCards.innerHTML = \`<span class="inline-block animate-spin mr-1">⚪</span> Menghapus...\`;

    try {
      const deletes = selectedIds.map(id => deleteDoc(doc(db, "cards", id)));
      await Promise.all(deletes);

      // Audit log
      try {
        await addDoc(collection(db, "audit_logs"), {
          actionType: "BATCH_DELETE",
          cardId: selectedIds.join(", "),
          actor: "Admin",
          details: \`Menghapus \${selectedIds.length} kartu secara massal\`,
          timestamp: new Date().toISOString(),
          status: "success"
        });
      } catch(e){}

      selectedCardsSet.clear();
      updateSelectedCardsUI();
      alert(\`Berhasil menghapus \${selectedIds.length} kartu.\`);
    } catch (err) {
      console.error("Gagal menghapus kartu terpilih:", err);
      alert("Gagal menghapus kartu: " + err.message);
    } finally {
      btnDeleteSelectedCards.disabled = false;
      updateSelectedCardsUI();
    }
  });
}

`;

if (dash.includes(scriptInsertionMarker)) {
  dash = dash.replace(scriptInsertionMarker, newEventHandlers + '\n' + scriptInsertionMarker);
  console.log('✅ Added delete card handlers and batch deletion functions to dashboard.html');
}

fs.writeFileSync('public/dashboard.html', dash, 'utf8');
console.log('✅ public/dashboard.html successfully updated with card deletion and sorting!');
