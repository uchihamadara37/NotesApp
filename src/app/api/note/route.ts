import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// GET: Ambil catatan user
export async function GET(req: Request) {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    console.log("mulai GET");

    if (!token) {
        return NextResponse.json({ error: "Unauthorized mas andre" }, { status: 401 });
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
        return NextResponse.json({ error: "Unauthorized mas andre" }, { status: 401 });
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


