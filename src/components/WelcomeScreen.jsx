import React from "react";
import logoWelcome from "../images/logo-welcome.png"

export default function WelcomeScreen({ tutorialTitle, onStartQuiz }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6
      bg-[var(--bg-primary)] text-[var(--text-primary)] transition"
    >
      <div
        className="w-full max-w-[var(--max-width-card)]
        p-10 rounded-2xl shadow-xl
        bg-[var(--bg-secondary)]
        border border-[var(--text-primary)]/20
        transition"
      >
        {/* LOGO + TITLE */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-2">
            <img
                                src={logoWelcome}
                                alt="LearnCheck Logo"
                                className="w-30 h-30"
                            />
          </div>

          <h1 className="text-5xl font-bold mb-2 text-[var(--blue-primary)]">
            LearnCheck!
          </h1>

          <p className="text-lg font-semibold text-[var(--text-secondary)]">
            Formative Assessment Powered with AI
          </p>
        </div>

        {/* CARD SUBMODUL */}
        <div
          className="p-8 rounded-2xl shadow-sm mb-8
          bg-[var(--bg-secondary)]
          border border-[var(--text-primary)]/20
          transition"
        >
          <p className="text-center text-sm mb-3 text-[var(--text-primary)]/70">
            Submodul Pembelajaran
          </p>

          <h2 className="text-center text-3xl font-semibold text-[var(--text-primary)]">
            {tutorialTitle || "Kriteria Data untuk AI"}
          </h2>
        </div>

        {/* BUTTON */}
        <button
          onClick={onStartQuiz}
          className="w-full py-4 text-xl font-bold rounded-2xl
          text-white bg-[var(--blue-primary)]
          hover:brightness-110 transition shadow"
        >
          Mulai Kuis
        </button>
      </div>
    </div>
  );
}
