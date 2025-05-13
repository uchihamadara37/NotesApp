"use client"

import { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

// import { onAuthStateChanged, User } from "firebase/auth";

import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";


// const updateNote = async (note: Note) => {
//   const response = await fetch(`/api/note/${note.id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(note),
//   });

//   const result = await response.json();
//   console.log(result);
// }


// const formatter = new Intl.DateTimeFormat("id-ID", {
//   day: "2-digit",
//   month: "long",
//   year: "numeric",
//   hour: "2-digit",
//   minute: "2-digit",
//   hour12: false, // Gunakan format 24 jam
// });
type Note = {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function NotesApp() {

  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const { user, loading } = useAuth();

  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // getValues,
  } = useForm<Note>({
    defaultValues: {
      title: "",
      text: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });

  const fetchNotes = async () => {
    console.log('Fetching notes dijalankan');
    if (!user) return; // Jika tidak ada user, keluar dari fungsi
    console.log('Fetching notes dijalankan 2');

    try {
      const token = await user.getIdToken();
      const response = await fetch(process.env.NEXT_PUBLIC_API_SERVER_URL + "api/note", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch notes");

      const data = await response.json();
      console.log("ini dia notesnya ", data);
      setNotes(data);


    } catch (error) {
      console.error("Error fetching notes:", error);
    }

  };

  useEffect(() => {
    const fetchNya = async () => {

      console.log('Fetching notes dijalankan');
      if (!user) return; // Jika tidak ada user, keluar dari fungsi
      console.log('Fetching notes dijalankan 2');

      try {
        const token = await user.getIdToken();
        const response = await fetch(process.env.NEXT_PUBLIC_API_SERVER_URL + "api/note", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch notes");

        const data = await response.json();
        console.log("ini dia notesnya ", data);
        setNotes(data);


      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    fetchNya();
  }, [user])


  const addOrUpdateNote = async (data: Note) => {
    if (!user) return;

    if (!data.title || !data.text) return;

    if (editingId) {
      notes.map(async (note) => {
        if (note.id === editingId) {

          // Update notes di Firestore
          try {
            const token = await user.getIdToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}api/note/${editingId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ title: data.title, text: data.text }),
            });

            const result = await response.json();
            console.log("Update response PUT:", result);
            fetchNotes();
          } catch (error) {
            console.error("Error updating note:", error);
          }


        }
      })

      setEditingId(null);

    } else {

      try {
        const token = await user.getIdToken();
        const response = await fetch(process.env.NEXT_PUBLIC_API_SERVER_URL + "api/note", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: data.title, text: data.text }),
        });

        const result = await response.json();
        console.log("Response dari server:", result);
        fetchNotes();

      } catch (error) {
        console.error("Error mengirim data:", error);
      }
    }

    reset(); // reset form
  };

  const editNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    setValue('title', note!.title || '');
    setValue('text', note!.text || '');    //
    setEditingId(id);
  };


  const confirmDelete = async () => {
    if (!user) return;
    if (!selectedNote) {
      return; // Jika note yang dipilih belum ada, keluar dari fungsi
    }
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}api/note/${selectedNote.id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("Delete response:", result);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
    setSelectedNote(null); // Tutup modal setelah delete
  };


  const handleLogout = async () => {
    // logout();
    try {
      await signOut(auth);
      console.log("User berhasil logout");
      // kalau mau redirect:
      router.push("/sign-in");
    } catch (error) {
      console.error("Gagal logout", error);
    }
    
    Cookies.remove("firebase-auth-token");
    Cookies.remove("user-name");
    router.push("/sign-in"); // Redirect ke halaman login setelah logout
  };

  return (
    <ProtectedRoute>

      <div className="min-h-screen bg-gray-900 text-slate-300 p-6">
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center px-2 md:px-20">
          <span className="text-sm md:text-2xl font-semibold">Welcome, {user?.displayName || user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </nav>
        <div className="max-w-xl mx-auto space-y-4">
          <h1 className="my-6 text-2xl font-bold text-center">Notes App</h1>

          <form onSubmit={handleSubmit(addOrUpdateNote)} className="flex flex-col bg-gray-800 text-slate-400 px-1 md:px-5 pt-5 md:pt-7 pb-5 rounded-3xl items-end">
            <Input
              className="!text-3xl mb-3 w-full rounded-md border-0 focus:outline-none focus:border-0 focus:ring-0 focus:border-transparent"
              placeholder="Title..."
              {...register('title')}
            />
            <Textarea
              className="!text-lg border-0 focus:outline-none focus:border-0 focus:ring-0 focus:border-transparent h-60 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent resize-none"
              placeholder="Tulis catatan..."
              {...register('text')}
            />
            <div className="w-36 mt-3 mr-4 md:mr-0">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 rounded-3xl" type="submit">
                {editingId ? "Update Catatan" : "Tambah Catatan"}
              </Button>

            </div>
          </form>
        </div>

        <div className="">
          <div className="flex mx-1 mt-10 flex-wrap gap-5 justify-center">
            {notes.map((note) => (
              <Card key={note.id} className="bg-gray-600 p-0 rounded-2xl md:rounded-3xl border-0 w-[100%] md:w-[30rem]">
                <CardHeader className="px-4 md:px-6 pt-3 md:pt-6 pb-2">
                  <CardTitle className="text-xl md:text-2xl font-semibold text-slate-300">{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-end px-4 md:px-6 pb-4 md:pb-6">
                  <p className="truncate text-slate-400">{note.text}</p>
                  <div className="flex gap-4 mt-5 items-end ">
                    <Button className="bg-gray-800 hover:bg-gray-700 rounded-3xl text-slate-400 hover:text-slate-200" onClick={() => editNote(note.id)}>Edit</Button>
                    <Dialog open={openModal} onOpenChange={setOpenModal}>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-slate-400 hover:bg-slate-200 text-slate-950 rounded-3xl"
                          onClick={() => setSelectedNote(note)}
                        >
                          Hapus
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Konfirmasi Hapus</DialogTitle>
                          <DialogDescription>
                            Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button onClick={() => {
                            setOpenModal(false);
                            setSelectedNote(null);
                          }} variant="outline">
                            Batal
                          </Button>
                          <Button onClick={() => {
                            setOpenModal(false);
                            confirmDelete();
                          }} className="bg-red-600 hover:bg-red-500">
                            Hapus
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <span className="text-slate-400 ml-auto text-xs md:text-sm">Updated {new Intl.DateTimeFormat("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(note.updatedAt))}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}
