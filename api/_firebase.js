const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");
const fs = require("fs");

let db = null;

function getDb() {
  if (db) return db;

  if (!getApps().length) {
    const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
    const explicitProjectId = process.env.FIREBASE_PROJECT_ID || "review-gmaps";

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(sa),
          projectId: sa.project_id || explicitProjectId
        });
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env:", e);
        initializeApp({ projectId: explicitProjectId });
      }
    } else if (fs.existsSync(serviceAccountPath)) {
      try {
        const sa = require(serviceAccountPath);
        initializeApp({
          credential: cert(sa),
          projectId: sa.project_id || explicitProjectId
        });
      } catch (e) {
        console.error("Failed to load serviceAccountKey.json:", e);
        initializeApp({ projectId: explicitProjectId });
      }
    } else {
      initializeApp({ projectId: explicitProjectId });
    }
  }

  db = getFirestore();
  return db;
}

module.exports = { getDb };
