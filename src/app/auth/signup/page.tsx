"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firestore-ға сақтаймыз
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        grade,
        email,
        createdAt: new Date(),
      });

      router.push("/"); // Тіркелген соң басты бетке
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
          📖 Әдеби әлемге қосылыңыз
        </h1>
        <p className="text-center text-gray-600 mb-8 italic">
          Сөз өнері мен шабыт жолында алғашқы қадамыңыз
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Аты-жөніңіз"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-gray-400"
          />
          <input
            type="text"
            placeholder="Сыныбыңыз"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            className="w-full p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-gray-400"
          />
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
            Тіркелу
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        <p className="text-sm text-gray-700 text-center mt-8">
          Аккаунтыңыз бар ма?{" "}
          <a
            href="./sign_in"
            className="text-amber-700 font-semibold hover:underline"
          >
            Кіру
          </a>
        </p>
      </div>
    </div>
  );
}
