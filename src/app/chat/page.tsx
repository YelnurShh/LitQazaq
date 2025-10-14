"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Қате: жауап табылмады 😢" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Сервермен байланыс жоқ 😔" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 text-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold text-center py-4 text-amber-700">
        💬 Қазақ әдебиеті — ЖИ көмекшісі
      </h1>

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

      {/* 🔤 Төменгі енгізу жолағы */}
      <div className="flex gap-2 p-4 md:p-6 border-t border-amber-200 bg-white/60 backdrop-blur-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Сұрақ қойыңыз... (мысалы: «Абайдың қара сөздері туралы айтып берші»)"
          className="flex-1 p-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-800"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 rounded-xl font-semibold text-amber-900 shadow-md transition"
        >
          Жіберу
        </button>
      </div>
    </main>
  );
}
