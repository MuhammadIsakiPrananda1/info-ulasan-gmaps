const fs = require('fs');

let panel = fs.readFileSync('public/panel.html', 'utf8');

// 1. Kembalikan script tailwind config di <head> tanpa modul firebase
const oldHeadScript = `  <script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "__FIREBASE_API_KEY__",
    authDomain: "__FIREBASE_AUTH_DOMAIN__",
    projectId: "__FIREBASE_PROJECT_ID__",
    storageBucket: "__FIREBASE_STORAGE_BUCKET__",
    messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
    appId: "__FIREBASE_APP_ID__",
    measurementId: "__FIREBASE_MEASUREMENT_ID__"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

    tailwind.config = {`;

const newHeadScript = `  <script>
    tailwind.config = {`;

panel = panel.replace(oldHeadScript, newHeadScript);

// 2. Pada script logika di bagian bawah (line 355), ubah menjadi type="module" dan letakkan import Firebase di sana
const oldMainScript = `  <!-- SCRIPT LOGIKA PANEL PEMILIK -->
  <script>
    const STORAGE_KEY = "ulasankuu_owner_session";`;

const newMainScript = `  <!-- SCRIPT LOGIKA PANEL PEMILIK -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
    import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "__FIREBASE_API_KEY__",
      authDomain: "__FIREBASE_AUTH_DOMAIN__",
      projectId: "__FIREBASE_PROJECT_ID__",
      storageBucket: "__FIREBASE_STORAGE_BUCKET__",
      messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
      appId: "__FIREBASE_APP_ID__",
      measurementId: "__FIREBASE_MEASUREMENT_ID__"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const STORAGE_KEY = "ulasankuu_owner_session";`;

panel = panel.replace(oldMainScript, newMainScript);

fs.writeFileSync('public/panel.html', panel, 'utf8');
console.log('✅ public/panel.html script properly configured with type=module and Firebase imports!');
