import React, { useState, useEffect } from "react";
import { useUrlParams } from "../hooks/useUrlParams";
import useLocalStorage from "../hooks/useLocalStorage";
import QuestionCard from "./QuestionCard";
import QuizResults from "./QuizResults";
import WelcomeScreen from "./WelcomeScreen";
import { checkSingleQuestion, calculateScore } from "../utils/quizLogic";

// ⬅️ IMPORT LENGKAP (SUDAH DIBENARKAN)
import { 
  fetchQuizDataAndPrefs, 
  generateHintAI, 
  submitQuizScore, 
  resetQuizHistory 
} from "../services/backendApi";

import { applyUserThemeToDocument } from "../utils/applyUserThemeToDocument";

export default function QuizContainer() {
  const { userId, tutorialId } = useUrlParams();
  const storageKey = `LEARNCHECK_STATE_${userId}_${tutorialId}`;

  const [quizState, setQuizState] = useLocalStorage(storageKey, null);
  const [userPrefs, setUserPrefs] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);

  const [aiHints, setAiHints] = useLocalStorage(
    `AI_HINTS_${userId}_${tutorialId}`,
    {}
  );

  const totalQuestions = quizState?.questions?.length || 0;
  const currentQuestion = quizState?.questions?.[currentQuestionIndex];
  const currentQuestionId = currentQuestion?.id;

  const isSubmitted =
    quizState?.checkedStatus?.[currentQuestionId]?.submitted || false;

  const isCorrect =
    quizState?.checkedStatus?.[currentQuestionId]?.isCorrect || false;

  const isAnswered =
    (quizState?.answers?.[currentQuestionId]?.length || 0) > 0;

  const isLast =
    currentQuestionIndex === totalQuestions - 1 &&
    Object.keys(quizState?.checkedStatus || {}).length === totalQuestions;

  // ================================
  // LOAD QUIZ + USER PREFS
  // ================================
  const loadQuizData = async () => {
    setIsLoading(true);

    try {
      const data = await fetchQuizDataAndPrefs(tutorialId, userId);

      applyUserThemeToDocument(data.userPreferences);
      setUserPrefs(data.userPreferences);

      setQuizState({
        questions: data.questions,
        userId,
        tutorialId,
        answers: {},
        checkedStatus: {},
        isCompleted: false,
        score: 0,
      });
    } catch (err) {
      console.error("LOAD QUIZ ERROR:", err);
      alert("Gagal memuat kuis dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!quizState) loadQuizData();
    else setIsLoading(false);
  }, [userId, tutorialId, quizState === null]);

  // ================================
  // HANDLE ANSWER SELECT
  // ================================
  const handleAnswerSelect = (qId, optionId) => {
    if (isSubmitted) return;

    const curr = quizState.answers[qId] || [];
    const updated = curr.includes(optionId)
      ? curr.filter((id) => id !== optionId)
      : [...curr, optionId];

    setQuizState({
      ...quizState,
      answers: {
        ...quizState.answers,
        [qId]: updated,
      },
    });
  };

  // ================================
  // HANDLE CHECK ANSWER + AI HINT
  // ================================
  const handleCheckAnswer = async () => {
    if (isSubmitted || !isAnswered) return;

    const selected = quizState.answers[currentQuestionId] || [];
    const correct = checkSingleQuestion(currentQuestion, selected);

    const newChecked = {
      ...quizState.checkedStatus,
      [currentQuestionId]: {
        submitted: true,
        isCorrect: correct,
      },
    };

    setQuizState({
      ...quizState,
      checkedStatus: newChecked,
    });

    if (!correct && !aiHints[currentQuestionId]) {
      try {
        const hint = await generateHintAI(tutorialId, currentQuestion.question);

        setAiHints({
          ...aiHints,
          [currentQuestionId]: hint,
        });
      } catch (err) {
        console.error("AI Hint Error:", err);
      }
    }
  };

  // ================================
  // SCORE VIEW (UPDATED)
  // ================================
  const handleViewScore = () => {
    const { score, correctCount } = calculateScore(quizState);

    setQuizState({
      ...quizState,
      isCompleted: true,
      score,
    });

    submitQuizScore(userId, tutorialId, score, totalQuestions);

    setShowResults(true);
  };

  // ================================
  // RESET PER-SOAL
  // ================================
  const resetCurrent = () => {
    const newAnswers = { ...quizState.answers };
    const newChecked = { ...quizState.checkedStatus };

    delete newAnswers[currentQuestionId];
    delete newChecked[currentQuestionId];

    setQuizState({
      ...quizState,
      answers: newAnswers,
      checkedStatus: newChecked,
    });

    setIsHintVisible(false);
  };

  // ================================
  // RESET (LOCAL FULL)
  // ================================
  const resetAll = () => {
    if (!window.confirm("Reset semua jawaban?")) return;

    setQuizState(null);
    setAiHints({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setIsWelcomeScreen(true);
  };

  // ================================
  // 🔥 RESET BACKEND + LOCAL (handleReset)
  // ================================
  const handleReset = async () => {
    const currentTheme = userPrefs.theme;

    if (!window.confirm("Apakah Anda yakin ingin me-reset seluruh kuis? Soal baru akan digenerate.")) 
      return;

    // 🔥 hapus Redis di backend
    await resetQuizHistory(tutorialId, userId);

    // reset lokal
    setQuizState(null);
    setCurrentQuestionIndex(0);
    setIsHintVisible(false);
    setShowResults(false);
    setIsWelcomeScreen(true);

    // mempertahankan theme user
    setUserPrefs({ theme: currentTheme });
  };

  // ================================
  // UI OUTPUT
  // ================================
  if (isLoading || !quizState || !currentQuestion) {
    return (
      <div className="min-h-40 flex items-center justify-center text-xl">
        Memuat Asesmen...
      </div>
    );
  }

  if (isWelcomeScreen) {
    return (
      <WelcomeScreen
        tutorialTitle={quizState.tutorialId}
        onStartQuiz={() => setIsWelcomeScreen(false)}
      />
    );
  }

  if (showResults) {
    return (
      <QuizResults
        score={{
          correct: quizState.correctCount,
          total: quizState.questions.length,
          score: quizState.score,
        }}
        onReset={resetAll}
        onExitToFirstQuestion={() => setShowResults(false)}
      />
    );
  }

  let ActionBtn;
  if (isSubmitted) {
    ActionBtn = (
      <button
        onClick={resetCurrent}
        className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg"
      >
        ↻ Ulang
      </button>
    );
  } else if (isAnswered) {
    ActionBtn = (
      <button
        onClick={handleCheckAnswer}
        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg"
      >
        Periksa
      </button>
    );
  } else {
    ActionBtn = (
      <button
        disabled
        className="px-6 py-2.5 bg-gray-400 text-white font-semibold rounded-lg"
      >
        Pilih Jawaban
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg-primary)] p-6 transition">
      <div className="max-w-[var(--max-width-content)] mx-auto rounded-2xl shadow-lg bg-[color:var(--bg-secondary)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-[color:var(--bg-primary)]/20">
          <div className="text-xl font-bold text-[color:var(--text-primary)]">LearnCheck!</div>
          <div className="text-md text-[color:var(--text-secondary)] opacity-70">{tutorialId}</div>

          {isSubmitted && (
            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${isCorrect ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
              {isCorrect ? "Benar" : "Salah"}
            </span>
          )}
        </div>

        {/* Question */}
        <div className="px-6 py-6">
          <QuestionCard
            key={currentQuestion.id}
            questionData={currentQuestion}
            questionIndex={currentQuestionIndex + 1}
            selectedAnswers={quizState.answers[currentQuestion.id] || []}
            onSelect={handleAnswerSelect}
            isDisabled={isSubmitted}
            hintText={currentQuestion.pre_hint}
            isHintVisible={isHintVisible}
            aiHint={aiHints[currentQuestionId]}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-between border-t border-[color:var(--bg-primary)]/20">
          
          <button onClick={() => setIsHintVisible(!isHintVisible)} className="px-5 py-2.5 bg-amber-300 rounded-lg font-semibold">
            💡 Petunjuk
          </button>

          {isLast && (
            <button onClick={handleViewScore} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg">
              Lihat Skor
            </button>
          )}

          <div className="flex space-x-3">
            <button onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))} disabled={currentQuestionIndex === 0}>
              &lt; Sebelumnya
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(i => Math.min(totalQuestions - 1, i + 1))}
              disabled={currentQuestionIndex === totalQuestions - 1}
            >
              Selanjutnya &gt;
            </button>

            {ActionBtn}
          </div>
        </div>
      </div>
    </div>
  );
}