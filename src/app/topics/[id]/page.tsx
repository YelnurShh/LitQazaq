import { topicsData } from "@/data/topics";
import Quiz from "@/components/Quiz";

export async function generateStaticParams() {
  return Object.keys(topicsData).map((id) => ({ id }));
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: keyof typeof topicsData }>;
}) {
  const { id } = await params;
  const topic = topicsData[id];

  if (!topic)
    return (
      <p className="text-center p-10 text-red-600 text-lg">
        Тақырып табылмады 😢
      </p>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-amber-800">
          {topic.title}
        </h1>
        <p className="mb-6 text-lg text-gray-700 leading-relaxed">
          {topic.description}
        </p>

        <iframe
          width="100%"
          height="400"
          src={topic.video}
          title={topic.title}
          className="w-full rounded-xl shadow-lg mb-8 border-4 border-amber-200"
          allowFullScreen
        ></iframe>

        <div className="bg-white p-5 rounded-2xl shadow-lg border border-amber-100">
          <h2 className="text-2xl font-semibold text-amber-700 mb-4">
            Тест сұрақтары ✍️
          </h2>
          <Quiz questions={topic.questions} topicId={id} />
        </div>
      </div>
    </main>
  );
}
