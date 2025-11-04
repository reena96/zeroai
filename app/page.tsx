'use client';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ZeroAI
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your AI-powered math tutor using Socratic dialogue
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Chat Interface Coming Soon
          </h2>
          <p className="text-gray-600">
            This is the foundational structure for the ZeroAI chat interface.
            Features will be added in upcoming stories.
          </p>
        </div>
      </main>
    </div>
  );
}
