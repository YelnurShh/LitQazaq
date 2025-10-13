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

export default function WeatherTasks() {
  const pageId = "page4"; // 🔹 әр бетке жеке ID
  const [openTask, setOpenTask] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Firestore-дан деректерді жүктеу
  useEffect(() => {
    const loadProgress = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.completedTasksList) {
          setCompleted(data.completedTasksList);
        }
      }
      setLoading(false);
    };
    loadProgress();
  }, []);

  const toggleTask = (index: number) => {
    setOpenTask(openTask === index ? null : index);
  };

  // 🔹 Тапсырманы орындау (check)
  const handleCheck = async (index: number) => {
    const key = `${pageId}-${index}`;
    setShowAnswer((prev) => ({ ...prev, [key]: !prev[key] }));

    const user = auth.currentUser;
    if (!user) {
      alert("Кіру қажет!");
      router.push("/auth/sign_in");
      return;
    }

    const ref = doc(db, "users", user.uid);

    if (!completed[key]) {
      const updated = { ...completed, [key]: true };
      await updateDoc(ref, {
        completedTasks: increment(1),
        completedTasksList: updated,
      });
      setCompleted(updated);
    }
  };

  // 🔹 Нәтижелерді тазарту
  const handleReset = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      completedTasks: 0,
      completedTasksList: {},
    });
    setCompleted({});
    setShowAnswer({});
    alert("Барлық нәтижелер тазартылды ✅");
  };

  // 🔹 Келесі бетке өту
  const handleNextPage = () => {
    router.push("/topics/page0");
  };

  // 🔹 Тапсырмалар тізімі
  const tasks: Task[] = [
    {
      title: "1-тапсырма: Ақпаратты табу",
      description:
        "«Жүзеге асушылық құйғысы» әдісі арқылы нұсқаулықтағы қауіпсіздік ережелерін анықта.",
      content: (
        <div className="mt-3 text-sm">
          <p className="mb-2 font-semibold">Сұрақ:</p>
          <p>Нұсқаулықта көрсетілген қауіпсіздік ережелерінің бірін белгілеңіз.</p>
          <ul className="list-none mt-3 space-y-1">
            <li>🔵 a) Құрылғыны судың жанына қоймау</li>
            <li>🟡 b) Қосылған күйінде қалдыру</li>
            <li>🔴 c) Балаларға құрылғыны пайдалануға рұқсат ету</li>
            <li>🟢 d) Құрылғыны ыстық ортада сақтау</li>
          </ul>
          <p className="mt-3">✔ Жауап: __________________________</p>
        </div>
      ),
      answer: (
        <div className="text-sm mt-2">
          <p>
            <b>Дұрыс жауап:</b> 🔵 a) Құрылғыны судың жанына қоймау.
          </p>
          <p>
            Бұл ереже құрылғының электр қауіпсіздігін қамтамасыз ету үшін маңызды.
          </p>
        </div>
      ),
    },
    {
      title: "2-тапсырма: Ақпаратты түсіну",
      description:
        "«Байланыстар шеңбері» әдісі арқылы терминдердің мағынасын және байланысын анықта.",
      content: (
        <div className="mt-3 text-sm">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">№</th>
                <th className="border p-2">🛠 Термин</th>
                <th className="border p-2">✍ Мағынасы</th>
              </tr>
            </thead>
            <tbody>
              {["Автоөшіру", "Қуат тұтыну", "Кепілдік мерзімі"].map(
                (term, i) => (
                  <tr key={i}>
                    <td className="border p-2 text-center">{i + 1}</td>
                    <td className="border p-2">{term}</td>
                    <td className="border p-2">
                      <input className="w-full border rounded p-1" />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <p className="mt-3">
            ✔ Қосымша: Шеңбердің ортасына “Құрылғыны пайдалану қауіпсіздігі”
            деп жазып, терминдердің байланысын сызыңыз.
          </p>
        </div>
      ),
      answer: (
        <div className="text-sm mt-2">
          <p>
            <b>Үлгі жауап:</b>
          </p>
          <ul className="list-disc ml-5">
            <li>Автоөшіру – құрылғыны автоматты түрде сөндіру функциясы</li>
            <li>Қуат тұтыну – құрылғының электр энергиясын пайдалану көлемі</li>
            <li>Кепілдік мерзімі – өндіруші қамтамасыз ететін қызмет ету уақыты</li>
          </ul>
        </div>
      ),
    },
    {
      title: "3-тапсырма: Ақпаратты талдау және салыстыру",
      description:
        "«Компас» әдісі арқылы екі нұсқаулықты салыстырып, тиімдісін анықта.",
      content: (
        <div className="mt-3 text-sm">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">🔧 Құрылғы</th>
                <th className="border p-2">⚡ Қуат тұтыну</th>
                <th className="border p-2">🔄 Қолдану уақыты</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Шаңсорғыш</td>
                <td className="border p-2">1200 Вт</td>
                <td className="border p-2">5 жыл</td>
              </tr>
              <tr>
                <td className="border p-2">Тоңазытқыш</td>
                <td className="border p-2">800 Вт</td>
                <td className="border p-2">10 жыл</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3">
            <p>1️⃣ Қай құрылғы көп қуат тұтынады?</p>
            <input className="border rounded p-1 w-full" />
            <p className="mt-2">2️⃣ Ұзағырақ қызмет ететін құрылғыны анықтаңыз.</p>
            <input className="border rounded p-1 w-full" />
          </div>
        </div>
      ),
      answer: (
        <div className="text-sm mt-2">
          <p>Көп қуат тұтынатыны: Шаңсорғыш (1200 Вт)</p>
          <p>Ұзағырақ қызмет ететіні: Тоңазытқыш (10 жыл)</p>
          <p className="mt-2">
            <b>Қорытынды:</b> Энергия үнемдеу және ұзақ пайдалану тұрғысынан
            тоңазытқыш тиімді.
          </p>
        </div>
      ),
    },
    {
      title: "4-тапсырма: Қорытынды жасау және дәлелдеу",
      description:
        "«Сендіру пирамидасы» әдісі арқылы қауіпсіздік ережелерінің маңызын түсіндір.",
      content: (
        <div className="mt-3 text-sm">
          <p>Нұсқаулықтағы қауіпсіздік ережелері не үшін маңызды?</p>
          <ul className="list-none mt-2 space-y-1">
            <li>🟢 a) Құрылғыны ұзақ және қауіпсіз пайдалану үшін</li>
            <li>🟡 b) Кепілдік мерзімін ұзарту үшін</li>
            <li>🔴 c) Тек нұсқаулық үшін қажет</li>
            <li>🔵 d) Қосымша ақпарат ретінде ғана берілген</li>
          </ul>
          <p className="mt-3">✔ Дұрыс жауабы: ______________________</p>
        </div>
      ),
      answer: (
        <div className="text-sm mt-2">
          <p>
            <b>Дұрыс жауап:</b> 🟢 a) Құрылғыны ұзақ және қауіпсіз пайдалану үшін.
          </p>
          <p>
            <b>Дәлел:</b> Қауіпсіздік ережелері құрылғының бұзылмауы мен адамның
            жарақат алмауын қамтамасыз етеді.
          </p>
        </div>
      ),
    },
    {
      title: "5-тапсырма: Өмірмен байланыстыру және шешім қабылдау",
      description:
        "«Себеп-салдарлық тұзақтар» әдісі арқылы жеке тәжірибеңізді қолданыңыз.",
      content: (
        <div className="mt-3 text-sm space-y-2">
          <p>
            Егер сіз жаңа құрылғы сатып алсаңыз, оның нұсқаулығын оқисыз ба?
            Жауабыңызды 3 аргументпен дәлелдеңіз.
          </p>
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <p>Себеп {n}: ___________________________</p>
              <p>Салдар {n}: ___________________________</p>
            </div>
          ))}
        </div>
      ),
      answer: (
        <div className="text-sm mt-2">
          <ul className="list-disc ml-5">
            <li>
              Себеп: Нұсқаулықты оқысам, құрылғыны дұрыс қолданамын. → Салдар:
              Ол ұзақ қызмет етеді.
            </li>
            <li>
              Себеп: Қауіпсіздік ережелерін білсем, жарақат алу қаупі азаяды.
            </li>
            <li>
              Себеп: Қолдану қателіктерін болдырмаймын. → Салдар: Кепілдік
              бұзылмайды.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  if (loading) return <p className="text-center mt-10">Жүктеліп жатыр...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Тұрмыстық техниканың нұсқаулығы
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

      {/* 🔹 Төменгі батырмалар */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleNextPage}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          🔄 Тапсырмаларды жаңарту
        </button>

        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          🧹 Нәтижелерді тазарту
        </button>
      </div>
    </div>
  );
}
