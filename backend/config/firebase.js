const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

// Load service account from config folder or backend folder
const configDir = __dirname;
const parentDir = path.join(configDir, "..");
const inConfig = path.join(configDir, "firebaseServiceAccount.json");
const inBackend = path.join(parentDir, "firebaseServiceAccount.json");
let serviceAccountPath = null;
if (fs.existsSync(inConfig)) {
  serviceAccountPath = inConfig;
} else if (fs.existsSync(inBackend)) {
  serviceAccountPath = inBackend;
}
if (!serviceAccountPath) {
  throw new Error(
    "Firebase service account not found. Place firebaseServiceAccount.json in backend/config/ or in backend/ (download from Firebase Console → Project settings → Service accounts → Generate new private key)."
  );
}
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

