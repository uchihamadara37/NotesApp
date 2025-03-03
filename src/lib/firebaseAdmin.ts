import admin from "firebase-admin";

//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.ADMIN_PROJECT_ID,
//       clientEmail: process.env.ADMIN_CLIENT_EMAIL,
//       privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });

// var serviceAccount = require("./kelembaban-ruang-firebase-adminsdk-ch4sq-0a59565977.json");
if (!admin.apps.length) {

  admin.initializeApp({
    credential: admin.credential.cert(
      // `{
      //   "type": "service_account",
      //   "project_id": "${process.env.ADMIN_PROJECT_ID}",
      //   "private_key_id": "${process.env.ADMIN_PRIVATE_KEY_ID}",
      //   "private_key": "${process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")}",
      //   "client_email": "${process.env.ADMIN_CLIENT_EMAIL}",
      //   "client_id": "${process.env.ADMIN_CLIENT_ID}",
      //   "auth_uri": "${process.env.ADMIN_AUTH_URI}",
      //   "token_uri": "${process.env.ADMIN_TOKEN_URI}",
      //   "auth_provider_x509_cert_url": "${process.env.ADMIN_AUTH_PROVIDER_X509_CERT_URL}",
      //   "client_x509_cert_url": "${process.env.ADMIN_CLIENT_X509_CERT_URL}",
      //   "universe_domain": "${process.env.ADMIN_UNIVERSE_DOMAIN}"
      // }`
        {
        projectId: process.env.ADMIN_PROJECT_ID,
        // privateKeyId: process.env.ADMIN_PRIVATE_KEY_ID,
        clientEmail: process.env.ADMIN_CLIENT_EMAIL,
        privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }
  ),
    databaseURL: "https://kelembaban-ruang-default-rtdb.firebaseio.com"
  });
}


export const db = admin.firestore();