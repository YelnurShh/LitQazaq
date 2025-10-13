"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  increment,
} from "firebase/firestore";

interface Task {
  title: string;
  description: string;
  content: ReactNode;
  answer: ReactNode;
}

export default function OkuSauatPage() {
  const [openTask, setOpenTask] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // 🔹 Firestore-дан пайдаланушының аяқталған тапсырмаларын жүктеу
  useEffect(() => {
    const fetchCompleted = async () => {
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

    fetchCompleted();
  }, []);

  const handleClick = () => {
    router.push("/topics/page1");
  };

  const toggleTask = (index: number) => {
    setOpenTask(openTask === index ? null : index);
  };

  const handleCheck = async (index: number) => {
    setShowAnswer((prev) => ({ ...prev, [index]: !prev[index] }));

    const user = auth.currentUser;
    if (!user) {
      alert("Кіру қажет!");
      router.push("/auth/sign_in");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      const snap = await getDoc(userRef);
      let userData = {};

      if (snap.exists()) {
        userData = snap.data();
      }

      // Егер бұрын бұл тапсырма аяқталмаса — сақтаймыз
      if (!completed[index]) {
        const updatedCompleted = { ...completed, [index]: true };

        await updateDoc(userRef, {
          completedTasks: increment(1),
          completedTasksList: updatedCompleted,
        });

        setCompleted(updatedCompleted);
      }
    } catch (err) {
      console.error("⚠️ Firestore қатесі:", err);
    }
  };

  // 🔹 Нәтижелерді тазарту функциясы
  const handleResetResults = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Кіру қажет!");
      router.push("/auth/sign_in");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        completedTasks: 0,
        completedTasksList: {},
      });

      setCompleted({});
      setShowAnswer({});
      alert("Барлық нәтижелер тазартылды ✅");
    } catch (err) {
      console.error("⚠️ Тазалау кезінде қате:", err);
    }
  };

 const tasks: Task[] = [
    {
      title: "1-тапсырма: Ақпараттың сенімділігін бағала",
      description:
        "Өнім қаптамасынан қажетті мәліметтерді тауып, кестені толтыр. Әр дерекке сенім деңгейін (0–10) қой.",
      content: (
        <table className="w-full border mt-3 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">№</th>
              <th className="border p-2">Мәлімет түрі</th>
              <th className="border p-2">Қаптамадан табылған ақпарат</th>
              <th className="border p-2">Сенім деңгейі (0–10)</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Өнім атауы",
              "Май түрі",
              "Өндіруші елінің коды",
              "Өнім көлемі",
              "Өндіріс тәсілі",
              "Жарамдылық мерзімі",
            ].map((item, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{item}</td>
                <td className="border p-2">
                  <input className="w-full border rounded p-1" />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    className="w-16 border rounded text-center p-1"
                    min={0}
                    max={10}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      answer: (
        <ul className="list-disc ml-5 mt-2 text-sm">
          <li>Өнім атауы: “Желанное” күнбағыс майы</li>
          <li>Май түрі: Рафинадталған, дезодорирленген</li>
          <li>Өндіруші елінің коды: KZ</li>
          <li>Өнім көлемі: 1 литр</li>
          <li>Өндіріс тәсілі: Холодный отжим</li>
          <li>Жарамдылық мерзімі: 12 ай</li>
        </ul>
      ),
    },
    {
      title: "2-тапсырма: Сценарийлік ойлану (Квадрант әдісі)",
      description:
        "Ситуация: Сен дүкенге барып, анаң үшін күнбағыс майын алуың керек. Төрт ықтимал сценарийді қарастыр.",
      content: (
        <div className="mt-2">
          <p>
            <b>Жауап сұрақтары:</b>
          </p>
          <p>1. Сен қай майды таңдайсың? Неге?</p>
          <textarea className="w-full border rounded p-2 mt-1" />
          <p className="mt-3">2. “Холодный отжим” белгісінің маңызы қандай?</p>
          <textarea className="w-full border rounded p-2 mt-1" />
        </div>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <p>
            <b>Үлгі жауап:</b> Мен “холодный отжим” бар майды таңдаймын, себебі
            ол табиғи және пайдалы май қышқылдарын сақтайды. Бұл майдың
            сапасы жоғары, денсаулыққа пайдалы.
          </p>
          <p className="mt-1">
            “Холодный отжим” – майды қыздырмай сығу әдісі, сондықтан өнімнің
            витаминдері мен дәмі жақсы сақталады.
          </p>
        </div>
      ),
    },
    {
      title: "3-тапсырма: Жасырын ақпараттарды байланыстыр",
      description:
        "Өнім қаптамасынан төмендегі ақпараттарды тап және олардың арасындағы байланысты анықта.",
      content: (
        <ul className="list-disc ml-5 mt-2 text-sm">
          <li>Сақтау шарттары: ______________________</li>
          <li>Энергетикалық құндылығы: ______________________</li>
          <li>ГМО бар ма?: ______________________</li>
          <li>Өңдеу тәсілі: ______________________</li>
          <li>Өндіруші компания атауы: ______________________</li>
        </ul>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <p>
            <b>Мысал байланыстар:</b>
          </p>
          <ul className="list-disc ml-5">
            <li>Сақтау шарттары → жарамдылық мерзіміне әсер етеді</li>
            <li>Өңдеу тәсілі → сапа мен энергетикалық құндылыққа әсер етеді</li>
            <li>ГМО → денсаулыққа ықтимал әсер</li>
          </ul>
        </div>
      ),
    },
    {
      title: "4-тапсырма: Қате ақпаратты тап!",
      description:
        "Мәлімдемелердің сенімділігін бағала. Ең төмен балл жинаған — қате мәлімдеме.",
      content: (
        <div className="mt-2 text-sm">
          <ol className="list-decimal ml-5">
            <li>Өнімнің көлемі — 5 литр.</li>
            <li>Өнім суық сығымдау әдісімен өндірілген.</li>
            <li>Бұл майдың құрамында ГМО бар.</li>
            <li>Өнім Қазақстанда өндірілген.</li>
          </ol>
          <p className="mt-2">
            Әр мәлімдемеге 0–10 балл аралығында үш өлшем бойынша баға қой:
            дәйектілік, сәйкестік, мақсат.
          </p>
        </div>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <p>
            <b>Қате мәлімдеме:</b> Өнімнің көлемі — 5 литр.
          </p>
          <p>
            <b>Дәлел:</b> Қаптамада нақты “1 л” деп жазылған. Сондықтан бұл
            ақпарат сәйкес келмейді.
          </p>
        </div>
      ),
    },
    {
      title: "5-тапсырма: Жарнама жаса",
      description:
        "Сен дүкенде сатушысың. Клиентті қызықтыру үшін осы майға жарнама жаса.",
      content: (
        <div className="mt-2">
          <p>1. Өнімнің 3 артықшылығын жаз:</p>
          <textarea className="w-full border rounded p-2 mt-1" />
          <p className="mt-3">2. Ұран (слоган) ойлап тап:</p>
          <input className="w-full border rounded p-2 mt-1" />
          <p className="mt-3">3. 30 секундтық жарнама мәтінін жаз:</p>
          <textarea className="w-full border rounded p-2 mt-1" />
        </div>
      ),
      answer: (
        <div className="mt-2 text-sm">
          <p>
            <b>Мысал:</b>
          </p>
          <ul className="list-disc ml-5">
            <li>Артықшылықтар: табиғи, пайдалы, сапалы өңделген</li>
            <li>Ұран: “Табиғат дәмін сезін!”</li>
            <li>
              Жарнама мәтіні: “Желанное — денсаулық пен дәм үйлесімі. Әр тамшы
              табиғаттың сыйы!”
            </li>
          </ul>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p className="text-center mt-10">Жүктеліп жатыр...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Оқу сауаттылығын дамытуға арналған жұмыс парағы
      </h1>

      {tasks.map((task, index) => (
        <div
          key={index}
          className="border rounded-2xl mb-4 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => toggleTask(index)}
            className={`w-full text-left px-5 py-3 font-semibold flex justify-between items-center ${
              completed[index]
                ? "bg-green-100 hover:bg-green-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <span>
              {task.title}{" "}
              {completed[index] && (
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

              {showAnswer[index] && (
                <div className="mt-4 p-3 border-l-4 border-green-500 bg-green-50">
                  <p className="font-semibold mb-1">Дұрыс жауап үлгісі:</p>
                  {task.answer}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

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
