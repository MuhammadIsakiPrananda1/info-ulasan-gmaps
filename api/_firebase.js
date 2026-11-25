const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");
const fs = require("fs");

let db = null;

function getDb() {
  if (db) return db;

  if (!getApps().length) {
    const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({ credential: cert(sa) });
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env:", e);
      }
    } else if (fs.existsSync(serviceAccountPath)) {
      const sa = require(serviceAccountPath);
      initializeApp({ credential: cert(sa) });
    } else {
      initializeApp();
    }
  }

  db = getFirestore();
  return db;
}

module.exports = { getDb };
