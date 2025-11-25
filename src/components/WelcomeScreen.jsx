import React from "react";

export default function WelcomeScreen({ tutorialTitle, onStartQuiz }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6
      bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] transition"
    >
      <div
        className="w-full max-w-[var(--max-width-card)]
        p-10 rounded-2xl shadow-xl
        bg-[color:var(--bg-secondary)]
        border border-[color:var(--bg-primary)]/20
        transition"
      >
        {/* LOGO + TITLE */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <svg
              className="w-20 h-20"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="var(--color-blue-primary)"
                stroke="var(--color-blue-primary)"
                strokeWidth="3"
              />
              <path
                d="M35 50L45 60L65 40"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M50 70L45 80L55 80L50 70Z"
                fill="var(--color-blue-primary)"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-bold mb-2 text-[color:var(--color-blue-primary)]">
            LearnCheck!
          </h1>

          <p className="text-lg font-semibold text-[color:var(--text-secondary)]">
            Formative Assessment Powered with AI
          </p>
        </div>

        {/* CARD SUBMODUL */}
        <div
          className="p-8 rounded-2xl shadow-sm mb-8
          bg-[color:var(--bg-primary)]/10
          border border-[color:var(--bg-primary)]/20
          transition"
        >
          <p className="text-center text-sm mb-3 text-[color:var(--text-primary)]/70">
            Submodul Pembelajaran
          </p>

          <h2 className="text-center text-3xl font-semibold text-[color:var(--text-primary)]">
            {tutorialTitle || "Kriteria Data untuk AI"}
          </h2>
        </div>

        {/* BUTTON */}
        <button
          onClick={onStartQuiz}
          className="w-full py-4 text-xl font-bold rounded-2xl
          text-white bg-[color:var(--color-blue-primary)]
          hover:brightness-110 transition shadow"
        >
          Mulai Kuis
        </button>
      </div>
    </div>
  );
}
