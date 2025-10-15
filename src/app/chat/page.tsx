"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const qaPairs = [
  {
    question: "Абай Құнанбайұлы кім?",
    answer:
      "Абай Құнанбайұлы — қазақтың ұлы ақыны, философы және ағартушысы. Ол қазақ әдеби тілін дамытуға зор үлес қосып, өз шығармаларында адамгершілік, білім мен еңбектің маңызын дәріптеген.",
  },
  {
    question: "«Қара сөздер» туралы айтып берші.",
    answer:
      "«Қара сөздер» — Абайдың философиялық еңбектері жинағы. Онда өмірдің мәні, адам болмысы, имандылық, білім, қоғам мәселелері терең талданады.",
  },
  {
    question: "Мұхтар Әуезов кім?",
    answer:
      "Мұхтар Әуезов — қазақ әдебиетінің классигі, драматург, ғалым және қоғам қайраткері. Оның ең атақты туындысы — «Абай жолы» эпопеясы.",
  },
  {
    question: "Магжан Жұмабаев туралы не білесің?",
    answer:
      "Мағжан Жұмабаев — қазақтың көрнекті ақыны, Алаш қозғалысының мүшесі. Оның поэзиясы сезімге, отаншылдыққа және рухани еркіндікке толы.",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuestionClick = async (question: string, answer: string) => {
    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // Имитация ЖИ ойлап жатқандай кідіріс жасаймыз ⏳
    setTimeout(() => {
      const aiMessage: Message = { role: "assistant", content: answer };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 text-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold text-center py-4 text-amber-700">
        💬 Қазақ әдебиеті — ЖИ көмекшісі
      </h1>

      {/* 📚 Дайын сұрақтар */}
      <div className="flex flex-wrap justify-center gap-2 px-4 mb-2">
        {qaPairs.map((q, i) => (
          <button
            key={i}
            onClick={() => handleQuestionClick(q.question, q.answer)}
            className="px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded-full text-sm md:text-base text-amber-900 font-medium shadow-sm transition"
          >
            {q.question}
          </button>
        ))}
      </div>

      {/* 💬 Чат аймағы */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 md:p-4 rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-amber-300 text-amber-900 rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-amber-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 p-3 md:p-4 rounded-2xl shadow border border-amber-100 animate-pulse">
              Жауап жазылып жатыр...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </main>
  );
}
