import admin from "firebase-admin";

//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.ADMIN_PROJECT_ID,
//       clientEmail: process.env.ADMIN_CLIENT_EMAIL,
//       privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });

var serviceAccount = require("./kelembaban-ruang-firebase-adminsdk-ch4sq-0a59565977.json");
if (!admin.apps.length) {
  
  admin.initializeApp({ 
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kelembaban-ruang-default-rtdb.firebaseio.com"
  });
}


export const db = admin.firestore();