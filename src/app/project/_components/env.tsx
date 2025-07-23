"use client";

const Env = () => {
  return (
    <div>
      <section className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">💻 개발 환경 (Tech Stack)</h2>
        <ul className="space-y-2 text-gray-800">
          <li>
            <strong>Frontend:</strong> Next.js (TypeScript), Tailwind CSS
          </li>
          <li>
            <strong>Backend:</strong> Supabase (Authentication, Database, Realtime)
          </li>
          <li>
            <strong>Deployment:</strong> Vercel
          </li>
          <li>
            <strong>Asset:</strong> ChatGPT 이미지 생성
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Env;
