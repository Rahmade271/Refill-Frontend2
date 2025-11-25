import React from "react";

export default function QuizResults({
  score,
  onReset,
  onExitToFirstQuestion,
}) {
  const { correct, total, score: percentage } = score || {
    correct: 0,
    total: 0,
    score: 0,
  };

  const isPassing = percentage >= 70;

  // Circle progress calculation
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div
      className="min-h-screen p-6 flex justify-center
             bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] transition"
    >
      <div className="w-full max-w-[var(--max-width-content)]">

        {/* HEADER */}
        <header
          className="px-6 py-4 flex items-center justify-between
                     bg-[color:var(--bg-secondary)]
                     border-b border-[color:var(--bg-primary)]/20
                     rounded-t-2xl shadow"
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center
                         bg-[color:var(--color-blue-primary)]"
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="leading-tight">
              <h1 className="text-xl font-bold text-[color:var(--color-blue-primary)]">
                LearnCheck!
              </h1>
              <p className="text-xs text-[color:var(--text-secondary)] opacity-70">
                Formative Assessment <br /> Powered with AI
              </p>
            </div>
          </div>

          <p className="text-lg font-semibold opacity-70">
            Hasil Kuis
          </p>
        </header>

        {/* CONTENT */}
        <div
          className="px-6 py-12 rounded-b-2xl shadow 
                     bg-[color:var(--bg-secondary)] transition"
        >
          <h1 className="text-5xl font-bold text-center mb-3">
            Selamat!
          </h1>
          <p className="text-center text-lg opacity-80 mb-10">
            Anda sudah menjawab seluruh pertanyaan.
          </p>

          {/* TWO-COLUMN RESULT CARD */}
          <div
            className="p-10 rounded-2xl border-2 shadow-sm mb-8
                       bg-[color:var(--bg-primary)]/10
                       border-[color:var(--bg-primary)]/20"
          >
            <div className="grid grid-cols-2 gap-8">

              {/* Total Soal */}
              <div className="flex flex-col items-center">
                <p className="text-2xl font-semibold opacity-80 mb-6">
                  Total Soal
                </p>
                <p className="text-8xl font-bold">
                  {total}
                </p>
              </div>

              {/* Score Circle */}
              <div className="flex flex-col items-center">
                <p className="text-2xl font-semibold opacity-80 mb-6">
                  Skor Kamu
                </p>

                <div className="relative w-56 h-56">
                  <svg className="transform -rotate-90 w-56 h-56">
                    <circle
                      cx="112"
                      cy="112"
                      r={radius}
                      stroke="var(--text-primary)"
                      strokeWidth="8"
                      opacity="0.15"
                      fill="none"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r={radius}
                      stroke={
                        isPassing
                          ? "var(--color-green-correct-primary)"
                          : "var(--color-red-wrong-primary)"
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-5xl font-bold ${
                        isPassing
                          ? "text-[color:var(--color-green-correct-primary)]"
                          : "text-[color:var(--color-red-wrong-primary)]"
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onExitToFirstQuestion}
              className="py-4 rounded-2xl font-bold text-xl
                         bg-[color:var(--color-green-correct-primary)]
                         text-white hover:brightness-110 transition"
            >
              Kembali ke Soal
            </button>

            <button
              onClick={onReset}
              className="py-4 rounded-2xl font-bold text-xl
                         bg-[color:var(--color-red-wrong-primary)]
                         text-white hover:brightness-110 transition"
            >
              Ulang Kuis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
