"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, dbFireStore } from "@/app/firebase/config"

import { doc, setDoc } from "firebase/firestore";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const registerUser = httpsCallable(functions, "registerUser");

// Skema validasi password dengan aturan tertentu
// const passwordSchema = z
//   .string()
//   .min(8, "Password harus minimal 8 karakter")
//   .regex(/[A-Z]/, "Password harus mengandung huruf besar")
//   .regex(/[a-z]/, "Password harus mengandung huruf kecil")
//   .regex(/[0-9]/, "Password harus mengandung angka")
//   .regex(/[\W_]/, "Password harus mengandung simbol (!@#$%^&*)");

const schema = z
  .object({
    name: z.string(),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus ada huruf besar")
      .regex(/[a-z]/, "Harus ada huruf kecil")
      .regex(/[0-9]/, "Harus ada angka")
      .regex(/[\W_]/, "Harus ada simbol (!@#$%^&*)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords tidak sama",
    path: ["confirmPassword"],
  });

interface formValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {

  const router = useRouter();

  const [createUserWithEmailAndPassword, user, loading, errorAuth] = useCreateUserWithEmailAndPassword(auth);

  if (errorAuth) {
    console.error("Error oi:", errorAuth.message);
    return;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });


  const onSubmit = async (data : formValues) => {
    try {
      console.log(data.email);
      const res = await createUserWithEmailAndPassword(data.email, data.password);

      if (res?.user){
        await setDoc(doc(dbFireStore, "users", res.user.uid), {
          name: data.name,
          email: data.email,
          createdAt: new Date(),
        });

        console.log("User berhasil disimpan di Firestore");
        router.push("/sign-in");
      }
      console.log(res);

    } catch (error) {
      console.error(error);
    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                id="name"
                {...register('name')}
                required
                placeholder="Enter your name"
              />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                id="email"
                {...register('email')}
                required
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                id="password"
                {...register('password')}
                required
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword')}
                required
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">Register</Button>
            <Button
              type="button"
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300"
              onClick={() => router.push("/")}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
