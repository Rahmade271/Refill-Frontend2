import React from "react";
import { checkSingleQuestion } from "../utils/quizLogic";
import { generateHintAI } from "../services/backendApi";

export default function QuestionCard({
  questionData,
  questionIndex,
  selectedAnswers,
  onSelect,
  isDisabled,
  hintText,
  isHintVisible,
  aiHint
}) {
  // FEEDBACK SECTION
  const renderFeedback = () => {
    if (!isDisabled) return null;

    const isCorrect = checkSingleQuestion(questionData, selectedAnswers);
    const feedbackText =
      questionData.feedback ||
      "Tinjau kembali materi dan pastikan memilih semua jawaban yang benar.";

    if (isCorrect) {
      return (
        <div
          className="mt-6 p-5 rounded-lg border-2
            bg-[color:var(--green-correct-secondary)]
            border-[color:var(--color-green-correct-primary)]
            text-[color:var(--color-green-correct-primary)]"
        >
          <p className="font-bold flex items-center mb-2">
            <span className="text-2xl mr-2">✅</span>
            <span className="text-lg">Benar! Kerja bagus!</span>
          </p>
          <p className="text-sm leading-relaxed ml-9">{feedbackText}</p>
        </div>
      );
    }

    return (
      <div
        className="mt-6 p-5 rounded-lg border-2
          bg-[color:var(--red-wrong-secondary)]
          border-[color:var(--color-red-wrong-primary)]
          text-[color:var(--color-red-wrong-primary)]"
      >
        <p className="font-bold flex items-center mb-2">
          <span className="text-2xl mr-2">❌</span>
          <span className="text-lg">Salah! Coba lagi!</span>
        </p>

        <p className="text-sm leading-relaxed mb-3 ml-9">
          {feedbackText || "Tinjau kembali materi ini, pastikan memahami poin pentingnya."}
        </p>

        {/* HINT */}
        {aiHint && ( 
        <div
          className="mt-3 p-4 rounded-lg border-2 ml-9
            bg-[color:var(--yellow-hint-secondary)]
            border-[color:var(--color-yellow-hint-primary)]
            text-[color:var(--color-yellow-hint-primary)]"
        >
          <p className="font-bold flex items-center mb-2">
            <span className="text-xl mr-2">💡</span>
            <span>Petunjuk</span>
          </p>
          <p className="text-sm leading-relaxed ml-8">{aiHint}</p>
        </div>
        )}
      </div>
    );
  };

  // OPTION STATE COLORS
  const getOptionStyle = (option) => {
    const isSelected = selectedAnswers.includes(option.id);

    if (!isDisabled) {
      // default (belum dicek)
      return `
        bg-[color:var(--bg-secondary)]
        border-[color:var(--text-primary)]/20
        hover:bg-[color:var(--bg-primary)]/10
      `;
    }

    // setelah periksa jawaban
    if (option.is_correct) {
      return `
        bg-[color:var(--green-correct-secondary)]
        border-[color:var(--color-green-correct-primary)]
        text-[color:var(--color-green-correct-primary)]
      `;
    }

    if (isSelected && !option.is_correct) {
      return `
        bg-[color:var(--red-wrong-secondary)]
        border-[color:var(--color-red-wrong-primary)]
        text-[color:var(--color-red-wrong-primary)]
      `;
    }

    // non dipilih & salah
    return `
      bg-[color:var(--bg-secondary)]
      border-[color:var(--bg-primary)]/30
      text-[color:var(--text-primary)]
    `;
  };

  return (
    <div
      className="p-6 rounded-xl shadow-sm
        bg-[color:var(--bg-secondary)]
        border border-[color:var(--bg-primary)]/20"
    >
      {/* Question Text */}
      <p className="text-xl font-medium mb-6 text-[color:var(--text-primary)]">
        {questionIndex}. {questionData.question}
      </p>

      {/* OPTIONS */}
      <div className="space-y-3">
        {questionData.options.map((option) => (
          <label
            key={option.id}
            className={`
              flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
              ${getOptionStyle(option)}
              ${isDisabled ? "cursor-default" : "cursor-pointer"}
            `}
          >
            <input
              type="checkbox"
              checked={selectedAnswers.includes(option.id)}
              disabled={isDisabled}
              onChange={() => onSelect(questionData.id, option.id)}
              className="mt-1 mr-3 h-5 w-5 rounded border-gray-300
                text-[color:var(--color-blue-primary)]
                focus:ring-[color:var(--color-blue-primary)]"
            />
            <span className="flex-1 leading-relaxed">
              {option.text}
            </span>
          </label>
        ))}
      </div>

      {/* HINT (manual show) */}
      {isHintVisible && !isDisabled && hintText && (
        <div
          className="mt-6 p-5 rounded-lg border-2
            bg-[color:var(--yellow-hint-secondary)]
            border-[color:var(--color-yellow-hint-primary)]
            text-[color:var(--color-yellow-hint-primary)]"
        >
          <p className="font-bold flex items-center mb-2">
            <span className="text-xl mr-2">💡</span>
            <span>Petunjuk</span>
          </p>
          <p className="text-sm leading-relaxed ml-8">{hintText}</p>
        </div>
      )}

      {/* FEEDBACK AFTER CHECK */}
      {renderFeedback()}
    </div>
  );
}
