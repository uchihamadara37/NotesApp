const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();



exports.registerUser = functions.https.onCall(async (data, context) => {
  const { uid, name, email } = data;

  if (!uid || !email) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "User ID dan email diperlukan"
    );
  }

  // Cek apakah user sudah ada
  const userDoc = await db.collection("users").doc(uid).get();
  if (userDoc.exists) {
    throw new functions.https.HttpsError(
      "already-exists",
      "User sudah terdaftar"
    );
  }

  // Simpan ke Firestore
  await db.collection("users").doc(uid).set({
    name,
    email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});
