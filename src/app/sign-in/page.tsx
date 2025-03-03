"use client"

import { useEffect} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";

import { auth } from "@/app/firebase/config"
import { useAuth } from "../context/authContext";


const loginScheme = z.object({
  email: z.string().email("email tidak valid").min(1, "tidak boleh kosong"),
  password: z.string().min(6, "minimal 8 huruf").min(1, "tidak boleh kosong"),
})

type typeLoginValues = z.infer<typeof loginScheme>

export default function LoginPage() {
  
  const router = useRouter();
  const { user } = useAuth(); // Ambil user dari context

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const {
    register: loginField,
    handleSubmit,
    formState: { errors: errorsForm },
  } = useForm<typeLoginValues>({
    resolver: zodResolver(loginScheme),
  })

  const onSubmit = async (data: typeLoginValues) => {
    // logic authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

      const token = await userCredential.user.getIdToken();

      Cookies.set('firebase-auth-token', token, { expires: 1, secure: true });

      console.log("Login berhasil:", userCredential.user);
      router.push("/"); // Redirect ke dashboard setelah login
      console.log("apakah jalan lagi?")
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Email atau password salah!");
    }


    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                {...loginField('email')}
                required
                placeholder="Enter your email"
              />
              {errorsForm.email && <p className="text-red-500 text-sm">{errorsForm.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                {...loginField("password")}
                required
                placeholder="Enter your password"
              />
              {errorsForm.password && <p className="text-red-500 text-sm">{errorsForm.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">Login</Button>

            <Button
              type="button"
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300"
              onClick={() => router.push("/sign-up")}
            >
              Register Now!
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
