"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState<string>("");

  useEffect(() => {
    const facts = [
      "Қазақтың тұңғыш романы — Мұхтар Әуезовтің «Абай жолы» эпопеясы болып саналады.",
      "Абай Құнанбайұлы — қазақ жазба әдебиетінің негізін қалаған ұлы ақын.",
      "1913 жылы «Қазақ» газеті алғаш рет жарық көріп, ұлттық әдебиеттің дамуына серпін берді.",
      "Ілияс Жансүгіров «Құлагер» поэмасы арқылы қазақ поэзиясын биік деңгейге көтерді.",
      "1989 жылы қазақ тілінің мемлекеттік мәртебесі заң жүзінде бекітілді.",
      "Жүсіпбек Аймауытов — қазақ әдебиетіндегі алғашқы психологиялық роман авторы."
    ];
    setFact(facts[Math.floor(Math.random() * facts.length)]);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 text-amber-800 px-4 md:px-8">
      {/* 🔹 Контент */}
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
          Қазақ әдебиетін заманауи әдіспен үйрен!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-amber-800 max-w-2xl mb-6 md:mb-8">
          Тапсырмалар орында, әдебиет әлемінде үздік бол!🌿
        </p>

        {/* 📖 Әдеби факт */}
        <section className="bg-white text-rose-800 rounded-2xl shadow-lg mt-6 md:mt-10 max-w-2xl w-full p-5 md:p-8 mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-3">📖 Бүгінгі әдеби факт</h2>
          <p className="text-base md:text-lg leading-relaxed">{fact}</p>
        </section>

        {/* 📚 Сабақтарға өту */}
        <section className="mt-6 md:mt-8">
          <Link
            href="/topics/page0"
            className="bg-yellow-300 text-rose-900 font-semibold px-5 md:px-6 py-3 rounded-xl shadow hover:bg-yellow-200 transition text-base md:text-lg"
          >
            ✨ Тапсырмаларға өту
          </Link>
        </section>
      </div>
    </main>
  );
}
