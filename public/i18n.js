/**
 * Ulasankuu Multi-Language (i18n) Engine
 * Mendukung Bahasa Indonesia (id) dan Bahasa Inggris (en)
 * Tersimpan di localStorage: 'ulasankuu_lang'
 */

const DICTIONARY = {
  // Navigation & General
  "Panel Pemilik Kartu": "Card Owner Panel",
  "Dashboard": "Dashboard",
  "Pusat Kendali Kartu Ulasankuu": "Ulasankuu Card Control Center",
  "NFC Cards": "NFC Cards",
  "Template Desain": "Design Templates",
  "Layout Sticker": "Sticker Layout",
  "QR Reset Kartu": "QR Reset Card",
  "Audit Log": "Audit Log",
  "Audit Log Sistem": "System Audit Log",
  "Kelola Admin": "Manage Admins",
  "Pengaturan": "Settings",
  "Keluar": "Logout",
  "Simpan": "Save",
  "Batal": "Cancel",
  "Hapus": "Delete",
  "Reset": "Reset",
  "Sistem Online · Real-time Sync": "System Online · Real-time Sync",
  "Monitoring distribusi kartu NFC, rasio ulasan Google aktif, dan performa merchant.": "Monitor NFC card distribution, active Google review ratio, and merchant performance.",
  "Sinkronkan Data": "Sync Data",
  "Buat Kartu Baru": "Create New Card",
  "Segarkan Log": "Refresh Logs",

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

  // Reset Kartu
  "Reset Kartu (Lupa PIN)": "Reset Card (Forgot PIN)",
  "Reset Kartu": "Reset Card",
  "Fitur pemulihan kartu jika pemilik kartu lupa PIN pengaman. Cukup masukkan ID Kartu atau scan QR, kartu akan otomatis dikembalikan ke status Belum Aktif agar dapat diaktivasi ulang secara bebas.": "Recovery tool if card owner forgot security PIN. Simply enter Card ID or scan QR code; the card will be set back to Inactive for fresh re-activation.",
  "Scan QR Kartu dengan Kamera": "Scan Card QR with Camera",
  "Scan QR Kartu": "Scan Card QR",
  "Masukkan ID Kartu atau scan QR fisik kartu. PIN tidak diperlukan.": "Enter Card ID or scan physical QR. No PIN required.",
  "Mode Reset Bebas PIN:": "PIN-Free Reset Mode:",
  "Semua data tautan bisnis, review URL, dan PIN lama akan langsung dihapus bersih dari Firestore, sehingga pemilik baru/lama dapat mengaktivasi kartu kembali.": "All business links, review URLs, and old PINs will be wiped from Firestore, allowing anyone to re-activate the card.",
  "Reset Kartu (Bersihkan PIN & Data)": "Reset Card (Clear PIN & Data)",

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

  // Dashboard Overview & Stats
  "Total Produksi Kartu": "Total Produced Cards",
  "tercatat di Cloud Firestore": "recorded in Cloud Firestore",
  "Kartu Aktif Digunakan": "Active Cards in Use",
  "kartu telah terhubung ulasan": "cards linked to reviews",
  "Stok Belum Aktivasi": "Inactive Stock",
  "Siap dikirim ke pembeli": "Ready to ship to buyers",
  "Kesehatan Database": "Database Health",
  "Normal (100%)": "Normal (100%)",

  // Audit Logs
  "Catatan riwayat seluruh aktivitas penting: aktivasi kartu, ganti URL review, update PIN, dan aksi admin.": "History of all critical activities: card activation, review URL change, PIN update, and admin actions.",
  "Cari Aktivitas / ID Kartu": "Search Activity / Card ID",
  "Ketik kata kunci atau ID kartu...": "Type keyword or card ID...",
  "Jenis Aktivitas": "Activity Type",
  "Semua Aktivitas": "All Activities",
  "Waktu Aktivitas": "Activity Time",
  "Aksi": "Action",
  "Pengguna": "Actor",
  "Rincian Aktivitas": "Activity Details",
  "Status": "Status",

  // Footer
  "Powered by": "Powered by"
};

const LANG_KEY = "ulasankuu_lang";

function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || "id";
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations();
  updateLangDropdownUI();
}

function t(text) {
  const lang = getCurrentLang();
  if (lang === "id") return text;
  const clean = (text || "").trim();
  return DICTIONARY[clean] || text;
}

function applyTranslations() {
  const lang = getCurrentLang();
  document.documentElement.lang = lang;

  const walkTextNodes = (element) => {
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.nodeValue.trim();
        if (raw && DICTIONARY[raw]) {
          if (!node._originalText) node._originalText = raw;
          node.nodeValue = node.nodeValue.replace(raw, lang === "en" ? DICTIONARY[raw] : node._originalText);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
        if (node.placeholder && DICTIONARY[node.placeholder.trim()]) {
          if (!node._originalPlaceholder) node._originalPlaceholder = node.placeholder.trim();
          node.placeholder = lang === "en" ? DICTIONARY[node._originalPlaceholder] : node._originalPlaceholder;
        }
        if (node.title && DICTIONARY[node.title.trim()]) {
          if (!node._originalTitle) node._originalTitle = node.title.trim();
          node.title = lang === "en" ? DICTIONARY[node._originalTitle] : node._originalTitle;
        }
        walkTextNodes(node);
      }
    }
  };

  walkTextNodes(document.body);
}

function updateLangDropdownUI() {
  const lang = getCurrentLang();
  document.querySelectorAll(".select-lang-dropdown").forEach(sel => {
    sel.value = lang;
  });
}

// Inisialisasi saat load
if (typeof window !== "undefined") {
  window.getCurrentLang = getCurrentLang;
  window.setLang = setLang;
  window.t = t;

  document.addEventListener("DOMContentLoaded", () => {
    updateLangDropdownUI();
    if (getCurrentLang() === "en") {
      setTimeout(applyTranslations, 60);
    }
  });
}
