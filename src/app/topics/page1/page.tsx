"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

interface Task {
  title: string;
  description: string;
  content: ReactNode;
  answer: ReactNode;
}

export default function CheckTasksPage({ pageId = "page1" }) {
  const [openTask, setOpenTask] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Firestore-дан жүктеу
  useEffect(() => {
    const loadUserProgress = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.completedTasksList) {
          setCompleted(data.completedTasksList);
        }
      }
      setLoading(false);
    };
    loadUserProgress();
  }, []);

  const handleClick = () => {
    router.push("/topics/page2");
  };

  const toggleTask = (index: number) => {
    setOpenTask(openTask === index ? null : index);
  };

  // 🔹 Тексеру батырмасы
  const handleCheck = async (index: number) => {
    const key = `${pageId}-${index}`;
    setShowAnswer((prev) => ({ ...prev, [key]: !prev[key] }));

    const user = auth.currentUser;
    if (!user) {
      alert("Кіру қажет!");
      router.push("/auth/sign_in");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    if (!completed[key]) {
      const updated = { ...completed, [key]: true };
      await updateDoc(userRef, {
        completedTasks: increment(1),
        completedTasksList: updated,
      });
      setCompleted(updated);
    }
  };

  // 🔹 Нәтижелерді тазарту
  const handleResetResults = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Кіру қажет!");
      router.push("/auth/sign_in");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      completedTasks: 0,
      completedTasksList: {},
    });

    setCompleted({});
    setShowAnswer({});
    alert("Барлық нәтижелер тазартылды ✅");
  };

  const tasks: Task[] = [
    {
      title: "1-тапсырма. «Жүзеге асушылық құйғысы» әдісі арқылы ақпаратты тап",
      description:
        "Чекті мұқият қараңыз және төмендегі сұрақтарға жауап беріңіз.",
      content: (
        <div className="mt-2 text-sm">
          <ol className="list-decimal ml-5 space-y-3">
            <li>
              Қай өнім ең қымбат?
              <input className="w-full border rounded p-2 mt-1" />
            </li>
            <li>
              Қай өнім ең арзан?
              <input className="w-full border rounded p-2 mt-1" />
            </li>
            <li>
              Егер сізде белгілі бір бюджет болса, қандай өнімдерді сатып ала
              аласыз?  
              👉 Тізім құрыңыз және әр таңдауыңызды негіздеңіз.
              <textarea className="w-full border rounded p-2 mt-1" rows={3} />
            </li>
          </ol>
        </div>
      ),
      answer: (
        <ul className="list-disc ml-5">
          <li>Ең қымбат өнім: Сары май — 1800 тг</li>
          <li>Ең арзан өнім: Нан — 150 тг</li>
          <li>Бюджет: 2000 тг → Нан, Сүт, Қант</li>
        </ul>
      ),
    },
    {
      title:
        "2-тапсырма. Ақпаратты түсіну және талдау («Егер… онда…» тізбегі әдісі)",
      description:
        "Жеңілдік пен қосымша өнім жағдайын талдап, есептеңіз.",
      content: (
        <div className="mt-2 text-sm">
          <p>1. Егер 10% жеңілдік болса, қанша үнемдейді?</p>
          <input className="w-full border rounded p-2" />
        </div>
      ),
      answer: <p>10% жеңілдік → 450 теңге үнемдейді</p>,
    },
    {
      title:
        "3-тапсырма. Ақпаратты қолдану және пайымдау («Себеп-салдарлық тұзақтар» әдісі)",
      description: "Себеп пен салдарды анықта.",
      content: (
        <div>
          <input className="w-full border rounded p-2" placeholder="Себеп..." />
          <input className="w-full border rounded p-2 mt-2" placeholder="Салдар..." />
        </div>
      ),
      answer: (
        <ul className="list-disc ml-5">
          <li>Себеп: Бағаларды салыстырдым → Салдар: ең тиімдісін таңдадым.</li>
        </ul>
      ),
    },
    {
      title: "4-тапсырма. Практикалық қолдану («Компас» әдісі арқылы)",
      description: "Өз чегіңізді зерттеп, компас сызбасын толтырыңыз.",
      content: (
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded p-2" placeholder="N (Мақсат)" />
          <input className="border rounded p-2" placeholder="S (Қазіргі жағдай)" />
          <input className="border rounded p-2" placeholder="W (Әрекеттер)" />
          <input className="border rounded p-2" placeholder="E (Кедергілер)" />
        </div>
      ),
      answer: (
        <ul className="list-disc ml-5">
          <li>N — Мақсат: Баға талдау</li>
          <li>S — Қазіргі жағдай: Чекте тек атаулар бар</li>
        </ul>
      ),
    },
  ];

  if (loading) return <p className="text-center mt-10">Жүктеліп жатыр...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        🧾 Чек бойынша оқу сауаттылығы тапсырмалары
      </h1>

      {tasks.map((task, index) => {
        const key = `${pageId}-${index}`;
        return (
          <div
            key={key}
            className="border rounded-2xl mb-4 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleTask(index)}
              className={`w-full text-left px-5 py-3 font-semibold flex justify-between items-center ${
                completed[key]
                  ? "bg-green-100 hover:bg-green-200"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span>
                {task.title}
                {completed[key] && (
                  <span className="ml-2 text-green-600 font-bold">✅</span>
                )}
              </span>
            </button>

            {openTask === index && (
              <div className="p-5">
                <p className="text-gray-700 text-sm">{task.description}</p>
                <div className="mt-3">{task.content}</div>

                <button
                  onClick={() => handleCheck(index)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Тексеру
                </button>

                {showAnswer[key] && (
                  <div className="mt-4 p-3 border-l-4 border-green-500 bg-green-50">
                    <p className="font-semibold mb-1">Дұрыс жауап үлгісі:</p>
                    {task.answer}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleClick}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          🔄 Тапсырмаларды жаңарту
        </button>

        <button
          onClick={handleResetResults}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          🧹 Нәтижелерді тазарту
        </button>
      </div>
    </div>
  );
}
