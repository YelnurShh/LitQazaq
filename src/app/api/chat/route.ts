import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Хабарлама бос 😕" }, { status: 400 });
    }

    // 1️⃣ Қазақшадан ағылшыншаға аудару (Google Translate)
    const translateToEng = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: message,
          target: "en",
          source: "kk",
        }),
      }
    );

    const engData = await translateToEng.json();
    const englishMessage =
      engData?.data?.translations?.[0]?.translatedText || message;

    // 2️⃣ Groq AI сұранысы (ағылшынша)
    const qroqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.QROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                `You are QazaqLiteratureAI — an expert assistant specializing in Kazakh literature, authors, poetry, and history.
  Always answer in English. Focus on:
  - classical and modern Kazakh writers (e.g., Abai, Mukhtar Auezov, Magzhan Zhumabayev)
  - analysis of poems, novels, and literary movements
  - cultural and historical background of Kazakh literature
  Be accurate, polite, and educational.`,
            },
            { role: "user", content: englishMessage },
          ],
        }),
      }
    );

    if (!qroqRes.ok) {
      const text = await qroqRes.text();
      console.error("Groq API error:", text);
      return NextResponse.json(
        { error: "Groq API жауап бермеді 😔" },
        { status: 500 }
      );
    }

    const data = await qroqRes.json();
    const replyEng = data?.choices?.[0]?.message?.content || "No response";

    // 3️⃣ Groq жауабын қазақшаға аудару
    const translateToKaz = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: replyEng,
          target: "kk",
          source: "en",
        }),
      }
    );

    const kazData = await translateToKaz.json();
    const replyKaz =
      kazData?.data?.translations?.[0]?.translatedText ||
      "Аударма табылмады 😅";

    // 4️⃣ Екі нұсқаны бірге қайтару
    return NextResponse.json({
      reply: replyKaz,
      original: replyEng,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Қате: серверден жауап келмеді 😔" },
      { status: 500 }
    );
  }
}
