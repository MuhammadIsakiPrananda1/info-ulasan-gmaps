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

    let credentialConfig = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credentialConfig = cert(sa);
      } catch (e) {
        console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT env:", e);
      }
    } else if (fs.existsSync(serviceAccountPath)) {
      try {
        const sa = require(serviceAccountPath);
        credentialConfig = cert(sa);
      } catch (e) {
        console.warn("Failed to require serviceAccountKey.json:", e);
      }
    }

    try {
      if (credentialConfig) {
        initializeApp({
          credential: credentialConfig,
          projectId: explicitProjectId
        });
      } else {
        initializeApp({
          projectId: explicitProjectId
        });
      }
    } catch (initErr) {
      console.warn("initializeApp warning:", initErr);
    }
  }

  try {
    db = getFirestore();
  } catch (fsErr) {
    console.warn("getFirestore warning:", fsErr);
  }
  return db;
}

module.exports = { getDb };
