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
  const pageId = "page2"; // 🔹 әр бетке жеке ID
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
    router.push("/topics/page3");
  };

  // 🔹 Тапсырмалар тізімі
   const tasks: Task[] = [
    {
      title: "1-тапсырма: Деректі жинау — «Сенімділік үшбұрышы» әдісі",
      description: "Инфографика негізінде деректерді талдау тапсырмасы.",
      content: (
        <div className="space-y-3 text-sm">
          <p>1. Инфографика қай ақпарат көзінен алынған?</p>
          <input className="w-full border rounded p-2" />

          <p>
            2. Ондағы мәліметтер қандай өлшем бірліктерімен берілген? (°C, м/с,
            мм және т.б.)
          </p>
          <input className="w-full border rounded p-2" />

          <p>3. Қандай символдар мен түстер қолданылған? Олар нені білдіреді?</p>
          <textarea className="w-full border rounded p-2" rows={2} />

          <h3 className="font-semibold mt-4">
            Сенімділік үшбұрышы бойынша бағала:
          </h3>
          <ul className="list-disc ml-5">
            <li>Дәйектілік (0–10): <input className="border rounded p-1 w-16 ml-2" /></li>
            <li>Сәйкестік (0–10): <input className="border rounded p-1 w-16 ml-2" /></li>
            <li>Мақсат (0–10): <input className="border rounded p-1 w-16 ml-2" /></li>
          </ul>

          <p className="mt-3">Қорытынды: Жалпы сенім бағасы: ________ / 30 балл</p>
        </div>
      ),
      answer: (
        <div className="text-sm space-y-1">
          <p><b>Мысал жауап:</b></p>
          <ul className="list-disc ml-5">
            <li>Ақпарат көзі: Қазгидромет ресми сайты.</li>
            <li>Өлшем бірліктері: °C, м/с, мм.</li>
            <li>Түстер: көк — суық, сары — жылы, қызыл — ыстық.</li>
            <li>Сенімділік: 28 / 30 балл.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "2-тапсырма: Ақпаратты түсіну және талдау — «Болашақтың ықтимал нұсқалары»",
      description: "Ауа райы болжамын талдап, ықтимал жағдайларды болжа.",
      content: (
        <div className="space-y-3 text-sm">
          <p>1. Сіздің аймағыңызда ауа райы қандай болады?</p>
          <input className="w-full border rounded p-2" />
          <p>2. Ауа температурасы мен жауын-шашын мөлшерін сипаттаңыз.</p>
          <textarea className="w-full border rounded p-2" rows={2} />
          <p>3. Желдің бағыты мен жылдамдығы қандай? Бұл неге маңызды?</p>
          <textarea className="w-full border rounded p-2" rows={2} />

          <h3 className="font-semibold mt-3">📌 Қосымша ойлану:</h3>
          <p>Егер ауа райы қалыпты әрі қолайлы болса, онда...</p>
          <input className="w-full border rounded p-2" />
          <p>Егер ауа райы қолайсыз болса (жаңбыр, боран), онда...</p>
          <input className="w-full border rounded p-2" />
          <p>Бұл жағдай адамдардың өміріне қалай әсер етуі мүмкін?</p>
          <textarea className="w-full border rounded p-2" rows={2} />
        </div>
      ),
      answer: (
        <div className="text-sm space-y-1">
          <p><b>Мысал жауап:</b></p>
          <ul className="list-disc ml-5">
            <li>Температура +10°C, жел 5 м/с, жауын-шашын жоқ.</li>
            <li>Қолайлы ауа райында адамдар далада серуендей алады.</li>
            <li>Қолайсыз жағдайда көлік қозғалысы қиындайды, суық тию қаупі бар.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "3-тапсырма: Ақпаратты қолдану — «Сценарийлік жоспарлау квадранты»",
      description: "Әр түрлі ауа райы сценарийлеріне сай әрекет ету.",
      content: (
        <div className="space-y-3 text-sm">
          <p>1. Мектепке бару:</p>
          <p>Егер жаңбырлы болса (+/–) → <input className="border rounded p-2 w-full" /></p>
          <p>Егер ашық болса (+/–) → <input className="border rounded p-2 w-full" /></p>

          <p>2. Пикник ұйымдастыру:</p>
          <p>Егер жақсы болса (+/–) → <input className="border rounded p-2 w-full" /></p>
          <p>Егер нашар болса (+/–) → <input className="border rounded p-2 w-full" /></p>

          <p>3. Ауыл шаруашылығымен айналысу:</p>
          <p>Егер қолайлы болса (+/–) → <input className="border rounded p-2 w-full" /></p>
          <p>Егер қолайсыз болса (+/–) → <input className="border rounded p-2 w-full" /></p>

          <p className="mt-3">
            Қорытынды: Ең тиімді шешім қандай?
          </p>
          <textarea className="w-full border rounded p-2" rows={2} />
        </div>
      ),
      answer: (
        <div className="text-sm space-y-1">
          <p><b>Мысал жауап:</b></p>
          <ul className="list-disc ml-5">
            <li>Жаңбырлы күні — қолшатыр, жылы киім; ашық күні — жеңіл киім.</li>
            <li>Пикник — жақсы ауа райында ашық аспанда, нашар болса жабық орында.</li>
            <li>Ауыл шаруашылығы — қолайсыз жағдайда суару және қорғаныс шаралары қажет.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "4-тапсырма: Шешім қабылдау — «Уақыт өте өзгеру графигі»",
      description: "Апталық ауа райын бақылап, салыстыру және қорытынды жасау.",
      content: (
        <div className="space-y-3 text-sm">
          <p>1. Бір апталық бақылау кестесін жасаңыз.</p>
          <textarea className="w-full border rounded p-2" rows={3} />

          <p>2. Болжам мен нақты деректерді салыстырыңыз.</p>
          <textarea className="w-full border rounded p-2" rows={2} />

          <p>3. График сипаттамасы:</p>
          <p>X — уақыт, Y — температура.</p>
          <textarea className="w-full border rounded p-2" rows={2} />

          <p>4. Қорытынды:</p>
          <textarea className="w-full border rounded p-2" rows={2} />

          <h3 className="font-semibold mt-3">📝 Қорытынды эссе:</h3>
          <textarea
            className="w-full border rounded p-2"
            placeholder="Ауа райы болжамының маңызы..."
            rows={4}
          />
        </div>
      ),
      answer: (
        <div className="text-sm space-y-1">
          <p><b>Мысал жауап:</b></p>
          <ul className="list-disc ml-5">
            <li>Болжамның дәлдігі 80% болды, кей күндер сәйкес келмеді.</li>
            <li>Себеп: ауа массасының өзгеруі, жел бағытының ауысуы.</li>
            <li>Келесі аптада ауа райы жылы және құрғақ болуы мүмкін.</li>
            <li>Эссе: Болжам адамдарға жоспар құруға, қауіптен сақтануға көмектеседі.</li>
          </ul>
        </div>
      ),
    },
  ];

  if (loading) return <p className="text-center mt-10">Жүктеліп жатыр...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        🌦 Ауа райы тақырыбындағы оқу сауаттылығы тапсырмалары
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
