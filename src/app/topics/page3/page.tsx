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
  const pageId = "page3"; // 🔹 әр бетке жеке ID
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
    router.push("/topics/page4");
  };

  // 🔹 Тапсырмалар тізімі
   const tasks: Task[] = [
    {
      title: "1-тапсырма: Ақпаратты табу (Пікірлерді талдау әдісі)",
      description:
        "Өзіңіз әкелген жол белгілерінің мағынасын анықтаңыз және пікірлерді салыстырыңыз.",
      content: (
        <div className="mt-2 text-sm space-y-2">
          <p>1️⃣ Белгі: <input className="border rounded p-1 ml-2" /></p>
          <p>2️⃣ Өз түсіндірмеңіз:</p>
          <textarea className="w-full border rounded p-2" />
          <p>3️⃣ Сыныптасыңыздың пікірі:</p>
          <textarea className="w-full border rounded p-2" />
          <p>4️⃣ Пікірлерді салыстыру:</p>
          <textarea className="w-full border rounded p-2" />
          <p>5️⃣ Ресми мағынасы:</p>
          <textarea className="w-full border rounded p-2" />
        </div>
      ),
      answer: (
        <div className="text-sm mt-2">
          <p>
            <b>Мысал:</b> Белгі 🚫 — «Енуге тыйым салынады». Бұл белгі жүргізушілерге белгілі бағытпен жүруге болмайтынын көрсетеді.
          </p>
        </div>
      ),
    },
    {
      title: "2-тапсырма: Ақпаратты түсіну (Байланыстар шеңбері әдісі)",
      description:
        "Жол белгілерін сәйкестендіріп, олардың өзара байланысын көрсетіңіз.",
      content: (
        <table className="w-full border mt-3 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">№</th>
              <th className="border p-2">Белгі</th>
              <th className="border p-2">Мағынасы</th>
            </tr>
          </thead>
          <tbody>
            {[
              { icon: "🏁", label: "Мәре" },
              { icon: "🚷", label: "Жүруге тыйым салу" },
              { icon: "🅿️", label: "Тұрақ орны" },
            ].map((b, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2 text-center text-lg">{b.icon}</td>
                <td className="border p-2">
                  <input className="w-full border rounded p-1" placeholder={`${b.label} мағынасы`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <p>
            <b>Мысал байланыстар:</b>
          </p>
          <ul className="list-disc ml-5">
            <li>🅿️ – тұрақ ↔ 🚷 – жүруге тыйым салу (көліктің қозғалысы/тоқтауына байланысты)</li>
            <li>🏁 – мәреге жету ↔ 🅿️ – көлікті қою (қозғалыстың аяқталуы)</li>
          </ul>
        </div>
      ),
    },
    {
      title: "3-тапсырма: Ақпаратты талдау және салыстыру (Компас әдісі)",
      description:
        "Берілген белгілердің мағынасын салыстырып, компас бойынша талдау жаса.",
      content: (
        <div className="mt-2 text-sm space-y-2">
          <table className="w-full border text-sm mb-3">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Белгі</th>
                <th className="border p-2">Мағынасы</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-center text-lg">⛔</td>
                <td className="border p-2">Енуге тыйым салынады</td>
              </tr>
              <tr>
                <td className="border p-2 text-center text-lg">⚠️</td>
                <td className="border p-2">Абайлаңыз, қауіпті аймақ</td>
              </tr>
            </tbody>
          </table>

          <p>1️⃣ Қай белгі жүргізушілерге қауіпсіздік шараларын ескертеді?</p>
          <textarea className="w-full border rounded p-2" />
          <p>2️⃣ Егер сіз велосипед айдап келе жатсаңыз, қай белгі сізге қатысты болады?</p>
          <textarea className="w-full border rounded p-2" />

          <h3 className="font-semibold mt-3">Компас:</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>N (Мақсат): <input className="border rounded p-1 ml-1" /></li>
            <li>S (Қазіргі жағдай): <input className="border rounded p-1 ml-1" /></li>
            <li>W (Әрекет): <input className="border rounded p-1 ml-1" /></li>
            <li>E (Кедергі): <input className="border rounded p-1 ml-1" /></li>
          </ul>
        </div>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <p><b>Жауап:</b></p>
          <ul className="list-disc ml-5">
            <li>⚠️ – қауіп туралы ескертеді.</li>
            <li>⛔ – қозғалыс бағытын шектейді, велосипедшіге де қатысты болуы мүмкін.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "4-тапсырма: Қорытынды жасау және дәлелдеу (Сендіру пирамидасы)",
      description:
        "Неліктен жол белгілері халықаралық стандарт бойынша белгіленеді?",
      content: (
        <div className="mt-2 text-sm space-y-2">
          <p>Дұрыс нұсқаны таңда:</p>
          <ul className="list-disc ml-5">
            <li>🟢 a) Әлемнің барлық елдерінде жүргізушілер оңай түсінуі үшін</li>
            <li>🟡 b) Әр ел өз белгілерін жасай алады</li>
            <li>🔴 c) Бұл тек полиция үшін</li>
            <li>🔵 d) Тек жүргізушілерге арналған</li>
          </ul>

          <p className="mt-2">✔ Таңдауыңыз:</p>
          <input className="w-full border rounded p-2" placeholder="Дұрыс нұсқаны жазыңыз" />

          <p className="mt-3 font-semibold">Сендіру пирамидасы:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Негізгі идея:</li>
            <li>Қысқаша дәлел:</li>
            <li>Мысал:</li>
            <li>Қорытынды:</li>
          </ol>
        </div>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <p><b>Дұрыс жауап:</b> a) Әлемнің барлық елдерінде жүргізушілер мен жаяу жүргіншілер оңай түсінуі үшін.</p>
          <p><b>Дәлел:</b> Халықаралық стандарттар адамдардың қай елде жүрсе де бірдей түсінуін қамтамасыз етеді.</p>
        </div>
      ),
    },
    {
      title: "5-тапсырма: Өмірмен байланыстыру (Себеп-салдарлық тұзақтар)",
      description:
        "Егер сіз турист ретінде басқа елге барсаңыз, жол белгілерін білу қаншалықты маңызды? 3 аргументпен дәлелде.",
      content: (
        <table className="w-full border mt-3 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">№</th>
              <th className="border p-2">Себеп</th>
              <th className="border p-2">Салдар</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((n) => (
              <tr key={n}>
                <td className="border p-2 text-center">{n}</td>
                <td className="border p-2">
                  <input className="w-full border rounded p-1" placeholder="Себеп" />
                </td>
                <td className="border p-2">
                  <input className="w-full border rounded p-1" placeholder="Салдар" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <ul className="list-disc ml-5">
            <li>Себеп: Белгілерді білмесем, көлікті дұрыс қоя алмауым мүмкін → Салдар: Айыппұл төлеуім мүмкін.</li>
            <li>Себеп: Белгілерді түсінбеу жол ережесін бұзуға әкеледі → Салдар: Қауіпсіздікке нұқсан.</li>
            <li>Себеп: Халықаралық белгілер таныс болса → Салдар: Кез келген елде өзімді сенімді сезінемін.</li>
          </ul>
        </div>
      ),
    },
  ];

  if (loading) return <p className="text-center mt-10">Жүктеліп жатыр...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Жол белгілерін түсіну. Символдар, пиктограммалар
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
