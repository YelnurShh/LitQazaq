"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

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
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        
        {/* 🌿 Логотип */}
        <div className="flex flex-col items-center mb-4 md:mb-6">
          <Image
            src="/logo.png" // логотип файлын /public/logo.png ішіне сал
            alt="LitQazaq логотипі"
            width={140}
            height={140}
            className="rounded-full shadow-md mb-2"
          />
          <h2 className="text-lg md:text-xl font-semibold text-rose-800">
            №290 орта мектеп
          </h2>
          <p className="text-sm md:text-base text-amber-700 italic">
            Автор: Аймыратова Гайнегул Абдижановна
          </p>
        </div>

        {/* 🏫 Негізгі мәтін */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
          Қазақ әдебиетін заманауи әдіспен үйрен!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-amber-800 max-w-2xl mb-6 md:mb-8">
          Тапсырмалар орында, әдебиет әлемінде үздік бол! 🌿
        </p>

        {/* 📖 Әдеби факт */}
        <section className="bg-white text-rose-800 rounded-2xl shadow-lg mt-6 md:mt-10 max-w-2xl w-full p-5 md:p-8 mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-3">📖 Бүгінгі әдеби факт</h2>
          <p className="text-base md:text-lg leading-relaxed">{fact}</p>
        </section>

        {/* 📚 Сабақтарға өту */}
        <section className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/topics/page0"
            className="bg-yellow-300 text-rose-900 font-semibold px-5 md:px-6 py-3 rounded-xl shadow hover:bg-yellow-200 transition text-base md:text-lg"
          >
            ✨ Тапсырмаларға өту
          </Link>

          <Link
            href="/chat"
            className="bg-rose-300 text-rose-900 font-semibold px-5 md:px-6 py-3 rounded-xl shadow hover:bg-rose-200 transition text-base md:text-lg"
          >
            🤖 ЖИ чаты
          </Link>
        </section>
         <section className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
            href="/kos_taps"
            className="bg-orange-300 text-rose-900 font-semibold px-5 md:px-6 py-3 rounded-xl shadow hover:bg-orange-200 transition text-base md:text-lg"
          >
            📚 Қосымша тапсырмалар
          </Link>
        </section>
      </div>
    </main>
  );
}
