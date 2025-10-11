"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // кіргеннен кейін басты бетке
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Белгісіз қате шықты");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-amber-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-amber-800 drop-shadow">
          ✒️ Әдеби әлемге кіру
        </h1>
        <p className="text-center text-gray-600 mb-8 italic">
          Шабыт пен сөз құдіретіне жол ашыңыз
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Электронды пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-gray-400"
          />
          <input
            type="password"
            placeholder="Құпиясөз"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-amber-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-amber-700 transition"
          >
            Кіру
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <p className="text-sm text-gray-700 text-center mt-8">
          Аккаунтыңыз жоқ па?{" "}
          <a
            href="./signup"
            className="text-amber-700 font-semibold hover:underline"
          >
            Тіркелу
          </a>
        </p>
      </div>
    </div>
  );
}
