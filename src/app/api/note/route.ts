import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
// import { auth } from "@/app/firebase/config";
import admin from "firebase-admin";

// type Note = {
//     id: string;
//     title: string;
//     text: string;
//     createdAt: Date;
//     updatedAt: Date;
// };

// Cek apakah admin sudah diinisialisasi
// if (!admin.apps.length) {
//     console.log("Menginisialisasi Firebase Admin...");
//     admin.initializeApp({
//         credential: admin.credential.cert({
//             projectId: process.env.ADMIN_PROJECT_ID,
//             clientEmail: process.env.ADMIN_CLIENT_EMAIL,
//             privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//         }),
//     });
// } else {
//     console.log("Firebase Admin sudah diinisialisasi.");
// }

// console.log("🛠️ ADMIN_PROJECT_ID:", process.env.ADMIN_PROJECT_ID);
// console.log("🛠️ ADMIN_CLIENT_EMAIL:", process.env.ADMIN_CLIENT_EMAIL);
// console.log("🛠️ ADMIN_PRIVATE_KEY (5 chars pertama):", process.env.ADMIN_PRIVATE_KEY?.slice(0, 5));
// console.log("🛠️ ADMIN_PRIVATE_KEY (akhir 5 chars):", process.env.ADMIN_PRIVATE_KEY?.slice(-5));


// GET: Ambil catatan user
export async function GET(req: Request) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    console.log("mulai GET");

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verifikasi token dan dapatkan UID
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Ambil catatan milik user ini
        const notesRef = db.collection("users").doc(uid).collection("notes");
        const snapshot = await notesRef.get();

        const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Tambah catatan user
export async function POST(req: Request) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verifikasi token dan dapatkan UID
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        const { title, text } = await req.json();

        const newNote = {
            title,
            text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await db.collection("users").doc(uid).collection("notes").add(newNote);

        return NextResponse.json({ id: docRef.id, ...newNote });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


