"use client";

import { FileText, Download } from "lucide-react";

export default function ExtraTasksPage() {
  const files = [
    {
      title: "📘 Оқу марафоны апта материалдары",
      link: "/files/ОҚУ МАРАФОНЫ АПТА МАТЕРИАЛДАРЫ.pdf",
    },
    {
      title: "🔍 8-сыныпқа жұмыс парағы",
      link: "/files/🔍 8-сыныпқа  ЖҰМЫС ПАРАҒЫ.pdf",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 px-4 py-10 text-amber-900">
      <div className="max-w-4xl mx-auto text-center">
        {/* 🏫 Бет атауы */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">📂 Қосымша тапсырмалар</h1>
        <p className="text-base md:text-lg text-amber-800 mb-10">
          Қазақ әдебиеті бойынша жүктеп алып, өз бетіңше орындайтын материалдар.
        </p>

        {/* 💾 Word файл карталары */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {files.map((file) => (
            <div
              key={file.title}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border border-amber-100 hover:border-amber-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4 group-hover:bg-amber-200 transition">
                  <FileText className="w-10 h-10 text-amber-800" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{file.title}</h2>

                <a
                  href={file.link}
                  download
                  className="inline-flex items-center gap-2 bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-amber-500 transition"
                >
                  <Download className="w-5 h-5" />
                  Файлды жүктеу
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
