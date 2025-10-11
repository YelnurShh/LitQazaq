"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<number>(0);
  const [fullName, setFullName] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/sign_in");
      } else {
        setUser(currentUser);

        // 🔹 Firestore-дан қосымша деректерді алу
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setPoints(data.points || 0);
          setFullName(data.fullName || "Аты-жөні енгізілмеген");
          setGrade(data.grade || "Сынып көрсетілмеген");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return <p className="text-center mt-10">Жүктеліп жатыр...</p>;
  }

  // 🔹 Ұпайға байланысты марапаттар
  const getBadge = () => {
    if (points >= 100) return "🏆 Алтын жеңімпаз";
    if (points >= 50) return "🥈 Күміс белсенді";
    if (points >= 20) return "🥉 Қола қатысушы";
    return "🌱 Жаңадан бастаушы";
  };

  return (
   <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 text-gray-900 px-6">
      <h1 className="text-4xl font-extrabold mb-8 text-amber-800 drop-shadow">
        Әдеби тұлға беті
      </h1>

      {user && (
        <div className="bg-white/90 text-amber-900 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center space-y-6">
          {/* 🔹 Жеке деректер */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-lg text-gray-700">{grade}-сынып оқушысы</p>
            <p className="text-md font-medium text-amber-700">
              email: {user.email}
            </p>
          </div>

          {/* 🔹 Ұпай және марапат */}
          <div className="mt-4 p-5 bg-amber-50 rounded-2xl shadow-inner">
            <p className="text-2xl font-extrabold text-amber-800">
              ⭐Ұпай: {points} 
            </p>
            <p className="mt-2 text-lg font-semibold italic">{getBadge()}</p>
          </div>

          {/* 🔹 Шығу батырмасы */}
          <button
            onClick={handleLogout}
            className="bg-rose-500 text-white px-6 py-3 rounded-2xl shadow-md hover:bg-rose-600 transition font-bold w-full"
          >
            Шығу
          </button>
        </div>
      )}
    </main>
  );
}
