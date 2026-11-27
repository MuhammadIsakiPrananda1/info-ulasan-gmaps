/**
 * Ulasankuu Comprehensive Multi-Language (i18n) Engine
 * Mendukung Bahasa Indonesia (id) dan Bahasa Inggris (en)
 * Menerjemahkan seluruh UI secara global, termasuk konten dinamis via MutationObserver.
 */

const DICT_ID_TO_EN = {
  // Navigation & Branding
  "Admin Dashboard & Studio Kartu NFC | Ulasankuu": "Admin Dashboard & NFC Card Studio | Ulasankuu",
  "Panel Pemilik Kartu | Ulasankuu": "Card Owner Panel | Ulasankuu",
  "Panel Pemilik Kartu NFC | Ulasankuu": "NFC Card Owner Panel | Ulasankuu",
  "Panel Pemilik Kartu": "Card Owner Panel",
  "Dashboard": "Dashboard",
  "NFC Cards": "NFC Cards",
  "Template Desain": "Design Templates",
  "Layout Sticker": "Sticker Layout",
  "QR Reset Kartu": "QR Reset Card",
  "Audit Log": "Audit Log",
  "Audit Log Sistem": "System Audit Log",
  "Kelola Admin": "Manage Admins",
  "Kelola Akun Admin": "Manage Admin Accounts",
  "Pengaturan": "Settings",
  "Pengaturan Aplikasi": "Application Settings",
  "Keluar": "Logout",
  "Simpan": "Save",
  "Batal": "Cancel",
  "Hapus": "Delete",
  "Reset": "Reset",
  "Kembali": "Back",
  "Tutup": "Close",
  "Sukses": "Success",
  "Gagal": "Failed",
  "Sistem Online · Real-time Sync": "System Online · Real-time Sync",
  "Pusat Kendali Kartu Ulasankuu": "Ulasankuu Card Control Center",
  "Monitoring distribusi kartu NFC, rasio ulasan Google aktif, dan performa merchant.": "Monitor NFC card distribution, active Google review ratio, and merchant performance.",
  "Sinkronkan Data": "Sync Data",
  "Buat Kartu Baru": "Create New Card",
  "Segarkan Log": "Refresh Logs",

  // Overview Metrics
  "Total Produksi Kartu": "Total Produced Cards",
  "tercatat di Cloud Firestore": "recorded in Cloud Firestore",
  "Kartu Aktif Digunakan": "Active Cards in Use",
  "kartu telah terhubung ulasan": "cards linked to reviews",
  "Stok Belum Aktivasi": "Inactive Stock",
  "Siap dikirim ke pembeli": "Ready to ship to buyers",
  "Kesehatan Database": "Database Health",
  "Normal (100%)": "Normal (100%)",
  "Rasio Aktivasi Kartu Pelanggan": "Customer Card Activation Ratio",
  "Perbandingan kartu yang sudah di-pairing link Google Review vs kartu stok awal.": "Comparison of cards paired with Google Review link vs raw stock cards.",
  "Teraktivasi": "Activated",
  "Kartu Aktif": "Active Cards",
  "Kartu Stok Awal": "Raw Stock Cards",
  "Distribusi Status Kartu": "Card Status Distribution",
  "Persentase kartu berstatus Aktif vs Belum Aktif": "Percentage of Active vs Inactive cards",
  "Aktif": "Active",
  "Belum Aktif": "Inactive",
  "Aktivitas Terkini": "Recent Activity",

  // Template Desain & Generator
  "template tersedia untuk cetak kartu review NFC": "templates available for NFC review card printing",
  "Tambah template": "Add template",
  "Tambah Template": "Add Template",
  "Tambah Template Baru": "Add New Template",
  "Generator Desain Kartu (10 x 10 cm)": "Card Design Generator (10 x 10 cm)",
  "QR Code digenerate dan otomatis menempati posisi QR template secara presisi.": "QR Code is generated and automatically fits the template QR spot precisely.",
  "Pilih template desain": "Select design template",
  "Pilih template": "Select template",
  "Jumlah Kartu": "Card Quantity",
  "Awalan ID (Prefix)": "ID Prefix",
  "Gunakan ID acak unik": "Use unique random ID",
  "Mulai Generate Kartu": "Start Generating Cards",
  "Pratinjau Hasil Desain": "Design Preview",
  "Download Semua (ZIP)": "Download All (ZIP)",
  "Download PNG": "Download PNG",
  "Download PDF": "Download PDF",
  "Hapus Template": "Delete Template",
  "Jadikan Template Default": "Set as Default Template",

  // Layout Sticker
  "Template & kartu": "Template & cards",
  "Template desain": "Design template",
  "Rentang ID": "ID Range",
  "Semua kartu": "All cards",
  "Dari ID": "From ID",
  "Sampai ID": "To ID",
  "Ukuran Kertas (Kanvas)": "Paper Size (Canvas)",
  "Ukuran Sticker (cm)": "Sticker Size (cm)",
  "Lebar": "Width",
  "Tinggi": "Height",
  "Jarak Antar Sticker (Gap cm)": "Gap Between Stickers (cm)",
  "Tampilkan Garis Potong (Cut Lines)": "Show Cut Lines",
  "Format Unduhan": "Download Format",
  "Kapasitas Cetak:": "Print Capacity:",
  "Unduh Layout Sticker": "Download Sticker Layout",

  // NFC Cards Table
  "Daftar Semua Kartu di Firestore": "List of All Cards in Firestore",
  "Data kartu tersimpan, status aktivasi, dan tujuan Google Maps.": "Stored card data, activation status, and Google Maps destination.",
  "Download Semua ZIP": "Download All ZIP",
  "Refresh": "Refresh",
  "Cari ID kartu, nama bisnis, atau URL...": "Search card ID, business name, or URL...",
  "Semua Status": "All Status",
  "Urutkan:": "Sort by:",
  "Terbaru Dibuat": "Newest Created",
  "Terlama": "Oldest",
  "ID (A-Z)": "ID (A-Z)",
  "Nama Bisnis (A-Z)": "Business Name (A-Z)",
  "Hapus Terpilih": "Delete Selected",
  "Nama Bisnis / Toko": "Business / Store Name",
  "Tujuan Link Google Maps": "Google Maps Destination Link",
  "Aksi": "Actions",
  "Belum ada kartu": "No cards available yet",

  // QR Reset Kartu
  "Reset Kartu (Lupa PIN)": "Reset Card (Forgot PIN)",
  "Reset Kartu": "Reset Card",
  "Fitur pemulihan kartu jika pemilik kartu lupa PIN pengaman. Cukup masukkan ID Kartu atau scan QR, kartu akan otomatis dikembalikan ke status Belum Aktif agar dapat diaktivasi ulang secara bebas.": "Card recovery tool if the owner forgot the security PIN. Simply enter Card ID or scan QR code; the card will be set back to Inactive for fresh re-activation.",
  "Scan QR Kartu dengan Kamera": "Scan Card QR with Camera",
  "Scan QR Kartu": "Scan Card QR",
  "Masukkan ID Kartu atau scan QR fisik kartu. PIN tidak diperlukan.": "Enter Card ID or scan physical QR. No PIN required.",
  "Mode Reset Bebas PIN:": "PIN-Free Reset Mode:",
  "Semua data tautan bisnis, review URL, dan PIN lama akan langsung dihapus bersih dari Firestore, sehingga pemilik baru/lama dapat mengaktivasi kartu kembali.": "All business links, review URLs, and old PINs will be wiped from Firestore, allowing anyone to re-activate the card.",
  "Reset Kartu (Bersihkan PIN & Data)": "Reset Card (Clear PIN & Data)",
  "Arahkan kamera ke QR Code fisik pada kartu NFC.": "Point the camera at the physical QR code on the NFC card.",

  // Audit Logs
  "Catatan riwayat seluruh aktivitas penting: aktivasi kartu, ganti URL review, update PIN, dan aksi admin.": "History of all critical activities: card activation, review URL change, PIN update, and admin actions.",
  "Cari Aktivitas / ID Kartu": "Search Activity / Card ID",
  "Ketik kata kunci atau ID kartu...": "Type keyword or card ID...",
  "Jenis Aktivitas": "Activity Type",
  "Semua Aktivitas": "All Activities",
  "Waktu Aktivitas": "Activity Time",
  "Pengguna": "Actor",
  "Rincian Aktivitas": "Activity Details",
  "Status": "Status",
  "Sukses": "Success",

  // Kelola Admin
  "Daftar akun pengelola yang memiliki wewenang akses login ke dashboard ini.": "List of manager accounts authorized to log in to this dashboard.",
  "Tambah Admin": "Add Admin",
  "Username / Admin": "Username / Admin",
  "Nama Lengkap": "Full Name",
  "Role": "Role",

  // Panel Pemilik Kartu
  "Login Pemilik Kartu": "Card Owner Login",
  "Masukkan ID Kartu NFC dan PIN yang Anda buat saat aktivasi.": "Enter the NFC Card ID and PIN you created during activation.",
  "ID Kartu": "Card ID",
  "PIN Pengaman": "Security PIN",
  "Masuk ke Panel": "Log in to Panel",
  "Kartu belum aktif? Tempelkan HP ke kartu fisik untuk aktivasi perdana.": "Card not active yet? Tap your phone to the physical card for first-time activation.",
  "Kartu NFC Terhubung · Real-time": "NFC Card Connected · Real-time",
  "Kartu NFC Terhubung": "NFC Card Connected",
  "Terhubung ke Google Review": "Connected to Google Review",
  "Tes Link Review": "Test Review Link",
  "Kelola Kartu": "Manage Card",
  "Hari Ini": "Today",
  "Minggu Ini": "This Week",
  "Bulan Ini": "This Month",
  "Total Semua": "All Time",
  "ulasan terbuka": "reviews opened",
  "total ulasan tercapai": "total reviews reached",
  "Aktivitas Tap/Scan 7 Hari Terakhir": "Tap/Scan Activity Past 7 Days",
  "Statistik aktual dari kartu fisik saat discan pelanggan.": "Actual stats from physical card when scanned by customers.",
  "Tap/Scan NFC": "NFC Tap/Scan",
  "Dialihkan ke Review": "Redirected to Review",
  "Ganti URL Tujuan Review": "Change Review Destination URL",
  "Cari Bisnis di Google Maps untuk mengisi link ulasan otomatis, atau tempel link manual di bawah.": "Search business on Google Maps for automatic review link, or paste manual URL below.",
  "Cari Bisnis di Google Maps": "Search Business on Google Maps",
  "Ketik nama bisnis / cabang Google Maps...": "Type business name / Google Maps location...",
  "Otomatis": "Automatic",
  "Direkomendasikan": "Recommended",
  "Pilih nama toko dari daftar rekomendasi agar link ulasan otomatis terisi.": "Select store name from recommendations to auto-fill review link.",
  "URL Tujuan Saat Ini": "Current Destination URL",
  "Atau Tempel URL Tujuan Manual": "Or Paste Manual Destination URL",
  "Simpan URL Baru": "Save New URL",
  "Ganti PIN Pengaman Kartu": "Change Card Security PIN",
  "PIN baru akan otomatis di-hash dengan standar enkripsi aman (SHA-256 + Salt) di database Firestore.": "New PIN is automatically hashed using secure encryption (SHA-256 + Salt) in Firestore database.",
  "PIN Lama": "Old PIN",
  "PIN Baru (4 Angka)": "New PIN (4 Digits)",
  "Konfirmasi PIN": "Confirm PIN",
  "Perbarui PIN Pengaman": "Update Security PIN",

  // Halaman Aktivasi (index.html)
  "Mengalihkan ke halaman review": "Redirecting to review page",
  "Mohon tunggu sebentar...": "Please wait a moment...",
  "Aktivasi Kartu": "Card Activation",
  "Kode kartu:": "Card code:",
  "Isi semua kolom di bawah untuk mengaktifkan kartu.": "Fill out all fields below to activate your card.",
  "Nama Bisnis": "Business Name",
  "Ketik nama bisnis di Google Maps...": "Type business name on Google Maps...",
  "Alamat Google Maps": "Google Maps Address",
  "Alamat terdeteksi otomatis dari Google": "Address automatically detected from Google",
  "URL Tujuan Review": "Review Destination URL",
  "Link otomatis menuju halaman tulis ulasan": "Automatic direct link to review write page",
  "PIN Pengaman (4 Angka)": "Security PIN (4 Digits)",
  "Buat 4 angka rahasia untuk mengubah link tujuan nanti": "Create 4 secret digits to update destination link later",
  "Aktifkan Kartu": "Activate Card",
  "Kartu Tidak Ditemukan": "Card Not Found",
  "Gagal Membaca Kartu": "Failed to Read Card",
  "Periksa koneksi internet Anda.": "Please check your internet connection.",

  // Login Page (login.html)
  "Login Administrator": "Administrator Login",
  "Masuk untuk mengelola kartu NFC, template, dan sistem Ulasankuu.": "Log in to manage NFC cards, templates, and Ulasankuu system.",
  "Username / Email": "Username / Email",
  "Kata Sandi": "Password",
  "Masuk ke Dashboard": "Log in to Dashboard",
  "Masuk": "Log in",
  "Lupa kata sandi? Hubungi Super Admin": "Forgot password? Contact Super Admin",

  // General & Footer
  "Powered by": "Powered by"
};

// Buat Reverse Dictionary (EN -> ID) secara otomatis
const DICT_EN_TO_ID = {};
for (const [idText, enText] of Object.entries(DICT_ID_TO_EN)) {
  DICT_EN_TO_ID[enText] = idText;
}

const LANG_KEY = "ulasankuu_lang";

function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || "id";
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations();
  updateLangDropdownUI();
}

function toggleLang() {
  setLang(getCurrentLang() === "id" ? "en" : "id");
}

function t(text) {
  const lang = getCurrentLang();
  const clean = (text || "").trim();
  if (lang === "en") {
    return DICT_ID_TO_EN[clean] || text;
  } else {
    return DICT_EN_TO_ID[clean] || text;
  }
}

// Function to translate a single node value
function translateString(str, targetLang) {
  if (!str) return str;
  const trimmed = str.trim();
  if (!trimmed) return str;

  if (targetLang === "en") {
    if (DICT_ID_TO_EN[trimmed]) {
      return str.replace(trimmed, DICT_ID_TO_EN[trimmed]);
    }
  } else {
    if (DICT_EN_TO_ID[trimmed]) {
      return str.replace(trimmed, DICT_EN_TO_ID[trimmed]);
    }
  }
  return str;
}

let isTranslating = false;

function applyTranslations(rootElement = document.body) {
  if (!rootElement || isTranslating) return;
  isTranslating = true;

  const lang = getCurrentLang();
  document.documentElement.lang = lang;

  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toUpperCase();
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || node.classList.contains("select-lang-dropdown")) {
            return NodeFilter.FILTER_REJECT;
          }
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let currentNode;
  while ((currentNode = walker.nextNode())) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      const val = currentNode.nodeValue;
      const translated = translateString(val, lang);
      if (translated !== val) {
        currentNode.nodeValue = translated;
      }
    } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      // Placeholders
      if (currentNode.placeholder) {
        currentNode.placeholder = translateString(currentNode.placeholder, lang);
      }
      // Titles / Tooltips
      if (currentNode.title) {
        currentNode.title = translateString(currentNode.title, lang);
      }
    }
  }

  isTranslating = false;
}

function updateLangDropdownUI() {
  const lang = getCurrentLang();
  document.querySelectorAll(".select-lang-dropdown").forEach(sel => {
    sel.value = lang;
  });
}

// MutationObserver agar elemen yang di-render secara dinamis oleh JavaScript otomatis ter-translate!
let mutationTimeout = null;
const observer = new MutationObserver((mutations) => {
  if (isTranslating) return;
  clearTimeout(mutationTimeout);
  mutationTimeout = setTimeout(() => {
    applyTranslations();
  }, 50);
});

if (typeof window !== "undefined") {
  window.getCurrentLang = getCurrentLang;
  window.setLang = setLang;
  window.toggleLang = toggleLang;
  window.t = t;

  document.addEventListener("DOMContentLoaded", () => {
    updateLangDropdownUI();
    applyTranslations();

    // Start observer for live dynamic updates
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  });
}
