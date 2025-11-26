import React, { useState, useEffect } from 'react';
import { useUrlParams } from '../hooks/useUrlParams';
import useLocalStorage from '../hooks/useLocalStorage';
import QuestionCard from './QuestionCard';
import QuizResults from './QuizResults';
import WelcomeScreen from './WelcomeScreen';
import { checkSingleQuestion, calculateScore } from '../utils/quizLogic';
import { fetchQuizDataAndPrefs, generateHintAI, resetSingleQuestion, resetAllQuestions } from '../services/backendApi';
import { applyUserThemeToDocument } from '../utils/applyUserThemeToDocument';

import hintLogoButton from '../images/hint-logo-button.png';
import logoLight from "../images/logo-light-mode.png";
import logoDark from "../images/logo-dark-mode.png";

export default function QuizContainer() {
  const { userId, tutorialId } = useUrlParams() || {};
  
  // Kunci storage unik per user + tutorial
  const storageKey = userId && tutorialId ? `LEARNCHECK_STATE_${userId}_${tutorialId}` : null;
  const prefsKey = userId ? `LEARNCHECK_PREFS_${userId}` : null;

  // Hooks state (selalu panggil hooks di top level, jangan di dalam if)
  const [quizState, setQuizState] = useLocalStorage(storageKey || 'TEMP_STATE', null);
  const [userPrefs, setUserPrefs] = useLocalStorage(prefsKey || 'TEMP_PREFS', {});
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(true);

  // Derived state
  const totalQuestions = quizState?.questions?.length || 0;
  const currentQuestion = quizState?.questions?.[currentQuestionIndex];
  const currentQuestionId = currentQuestion?.id;
  const isCompleted = quizState?.isCompleted || false;
  
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isCurrentQuestionSubmitted = quizState?.checkedStatus?.[currentQuestionId]?.submitted || false;
  const isCurrentQuestionCorrect = quizState?.checkedStatus?.[currentQuestionId]?.isCorrect || false;
  const isCurrentQuestionAnswered = (quizState?.answers?.[currentQuestionId]?.length || 0) > 0;
  const isAllQuestionsChecked = totalQuestions > 0 && Object.keys(quizState?.checkedStatus || {}).length === totalQuestions;

  // 1. Reset tampilan UI lokal saat User/Tutorial berubah
  useEffect(() => {
    if (!userId || !tutorialId) return;
    setCurrentQuestionIndex(0);
    setIsHintVisible(false);
    setShowResults(false);
    setIsWelcomeScreen(true);
    // Kita TIDAK mereset quizState/userPrefs disini karena useLocalStorage sudah menanganinya
  }, [userId, tutorialId]);

  // 2. Apply Theme setiap kali userPrefs berubah
  useEffect(() => {
    if (userPrefs && Object.keys(userPrefs).length > 0) {
      applyUserThemeToDocument(userPrefs);
    }
  }, [userPrefs]);

  // 3. Load Data dari Backend
  const loadQuizData = async () => {
    if (!userId || !tutorialId) return;
    
    setIsLoading(true);
    try {
      const data = await fetchQuizDataAndPrefs(tutorialId, userId);
      
      // LOGIC PENTING: Jangan timpa preferensi lokal jika sudah ada!
      setUserPrefs((prevLocalPrefs) => {
        const remotePrefs = data.userPreferences || {};
        
        // Jika lokal kosong, pakai dari BE.
        // Jika lokal ada isinya, pertahankan lokal (karena ini state browser terakhir user)
        // Merge strategy: Local > Remote
        return {
            ...remotePrefs,      // Base dari remote
            ...prevLocalPrefs,   // Timpa dengan lokal (theme, fontsize, dll)
        };
      });

      // Set Quiz State hanya jika belum ada di local storage atau perlu refresh
      if (!quizState || quizState.tutorialId !== tutorialId) {
          setQuizState({
            questions: data.questions,
            userId,
            tutorialId,
            moduleTitle: data.metadata?.moduleTitle || "Submodul Pembelajaran",
            contextText: data.metadata?.contextText || "",
            answers: {},
            checkedStatus: {},
            aiHints: {},
            isCompleted: false,
            score: 0
          });
      }
    } catch (error) {
      console.error("Gagal memuat data kuis:", error);
      alert(`Gagal memuat kuis. Cek konsol.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger load data awal
  useEffect(() => {
    // Load hanya jika quizState kosong atau id berubah
    if (userId && tutorialId && (quizState === null || quizState.userId !== userId)) {
        loadQuizData();
    }
  }, [userId, tutorialId]); // Hapus quizState dari dependency agar tidak loop

  // --- HANDLERS (Sama seperti sebelumnya, dirapikan sedikit) ---

  const handleAnswerSelect = (questionId, optionId) => {
    if (isCurrentQuestionSubmitted || isLoading || !quizState) return;

    const currentAnswers = quizState.answers[questionId] || [];
    const isSelected = currentAnswers.includes(optionId);
    
    const newAnswers = isSelected
      ? currentAnswers.filter(id => id !== optionId)
      : [...currentAnswers, optionId];

    setQuizState({
      ...quizState,
      answers: {
        ...quizState.answers,
        [questionId]: newAnswers,
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsHintVisible(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setIsHintVisible(false);
    }
  };

  const handleShowHint = () => {
    setIsHintVisible(prev => !prev);
  };

  const handleCheckAnswer = async () => {
    if (isCurrentQuestionSubmitted || isLoading || !currentQuestion) return;

    const qid = currentQuestion.id;
    const answers = quizState.answers[qid] || [];
    const isCorrect = checkSingleQuestion(currentQuestion, answers);
    let initialHint = currentQuestion.hint || null;

    setQuizState(prev => ({
      ...prev,
      checkedStatus: {
        ...prev.checkedStatus,
        [qid]: { submitted: true, isCorrect, attemptCount: (prev.checkedStatus?.[qid]?.attemptCount || 0) + 1 }
      },
      aiHints: {
        ...prev.aiHints,
        [qid]: initialHint
      }
    }));

    setIsHintVisible(false);

    if (!isCorrect && !initialHint) {
       // Panggil AI Hint jika salah dan belum ada hint statis
       generateHintAI({
           tutorialId,
           qid,
           question: currentQuestion.question,
           contextText: quizState.contextText,
           studentAnswer: answers,
           options: currentQuestion.options
       }).then(hint => {
           setQuizState(prev => ({
               ...prev,
               aiHints: {
                   ...prev.aiHints,
                   [qid]: hint || "Hint tidak tersedia."
               }
           }));
       });
    }
  };

  const handleViewScore = () => {
    if (!isCompleted) {
      const results = calculateScore(quizState);
      setQuizState({
        ...quizState,
        isCompleted: true,
        score: results.score,
        correctCount: results.correctCount,
      });
    }
    setShowResults(true);
  };

  const handleResetCurrentQuestion = async () => {
    const qIndex = currentQuestionIndex;
    try {
        const newQuestionData = await resetSingleQuestion(tutorialId, userId, qIndex);
        const updatedQuestions = [...quizState.questions];
        updatedQuestions[qIndex] = newQuestionData.questions[0];

        const newAnswers = { ...quizState.answers };
        const newCheckedStatus = { ...quizState.checkedStatus };
        
        delete newAnswers[currentQuestionId];
        delete newCheckedStatus[currentQuestionId];

        setQuizState({
            ...quizState,
            questions: updatedQuestions,
            answers: newAnswers,
            checkedStatus: newCheckedStatus
        });
        setIsHintVisible(false);
    } catch (err) {
        console.error("Failed regenerate question:", err);
        alert("Gagal mengambil soal baru.");
    }
  };

  const handleReset = async () => {
      // Simpan theme sebelum reset total (opsional, karena userPrefs terpisah)
      if (!window.confirm("Yakin reset semua soal?")) return;
      
      try {
          await resetAllQuestions(tutorialId, userId);
          // Force reload logic
          setQuizState(null); // Ini akan memicu useEffect loadQuizData
          setCurrentQuestionIndex(0);
          setIsHintVisible(false);
          setShowResults(false);
          setIsWelcomeScreen(true);
      } catch (err) {
          console.error("Reset gagal:", err);
          alert("Gagal mereset soal.");
      }
  };

  const handleExitToFirstQuestion = () => {
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setIsHintVisible(false);
  };

  const handleStartQuiz = async () => {
    if (!quizState) {
        await loadQuizData();
    }
    setIsWelcomeScreen(false);
  };

  const renderStatusBadge = () => {
      if (!isCurrentQuestionSubmitted) return null;
      return (
          <div className={`px-5 py-2 rounded-full text-sm font-semibold border-2 ml-auto ${
              isCurrentQuestionCorrect 
              ? "bg-[var(--green-secondary)] border-[var(--green-primary)] text-[var(--green-primary)]"
              : "bg-[var(--red-secondary)] border-[var(--red-primary)] text-[var(--red-primary)]"
          }`}>
              {isCurrentQuestionCorrect ? "Benar" : "Salah"}
          </div>
      );
  };

  // --- RENDER ---

  if (!userId || !tutorialId) {
      return <div className="p-10 text-center text-red-500">Error: URL Parameter ?user=... &tutorial=... wajib ada.</div>;
  }

  if (isLoading && !quizState) {
    return <div className="min-h-screen flex items-center justify-center text-xl bg-[var(--bg-primary)] text-[var(--text-primary)]">Memuat Asesmen...</div>;
  }

  if (showResults) {
      const finalScore = {
          correct: quizState.correctCount || 0,
          total: quizState.questions.length,
          score: quizState.score || 0
      };
      return <QuizResults theme={userPrefs.theme} score={finalScore} onReset={handleReset} onExitToFirstQuestion={handleExitToFirstQuestion} />;
  }

  if (isWelcomeScreen) {
      return <WelcomeScreen tutorialTitle={quizState?.moduleTitle} onStartQuiz={handleStartQuiz} theme={userPrefs.theme} />;
  }

  // Styles
  const secondaryBtn = `px-5 py-2.5 border-2 rounded-lg font-medium transition disabled:opacity-50 border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]`;
  const primaryBtn = `px-6 py-2.5 bg-[var(--blue-primary)] text-white font-bold rounded-lg hover:brightness-110 transition disabled:bg-gray-500`;
  const resetBtn = `px-5 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:brightness-110 transition flex items-center`;

  const isDark = userPrefs.theme === "dark";
  const logoSrc = isDark ? logoDark : logoLight;
  const titleColor = isDark ? "text-[var(--text-secondary)]" : "text-[var(--blue-primary)]";

  let MainActionButton;
  if (isCurrentQuestionSubmitted) {
      MainActionButton = (
          <button onClick={handleResetCurrentQuestion} className={resetBtn}>
              <span className="mr-1">↻</span> Ulang
          </button>
      );
  } else if (isCurrentQuestionAnswered) {
      MainActionButton = (
          <button onClick={handleCheckAnswer} className={primaryBtn}>Periksa</button>
      );
  } else {
      MainActionButton = (
          <button onClick={handleResetCurrentQuestion} className={resetBtn}>
             <span className="mr-1">↻</span> Ulang
          </button>
      );
  }

  return (
    <div className="min-h-screen py-6 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="max-w-[var(--max-width-content)] w-full mx-auto px-4">
        <div className="rounded-xl shadow-md overflow-hidden bg-[var(--bg-secondary)] border border-[var(--text-primary)]/20">
          
          {/* HEADER */}
          <div className="p-5 flex justify-between items-center border-b border-[var(--text-primary)]/20">
            <div className="flex items-center">
                <img src={logoSrc} alt="LearnCheck Logo" className="w-18 h-18" />
                <div className="leading-tight ml-3">
                    <span className={`block text-2xl font-bold ${titleColor}`}>LearnCheck!</span>
                    <span className={`block text-xs ${titleColor}`}>Formative Assessment<br/>Powered with AI</span>
                </div>
            </div>
            <div className="flex-1 text-center px-4">
                <p className="text-lg font-medium text-[var(--text-primary)]">{quizState.moduleTitle}</p>
            </div>
            {renderStatusBadge()}
          </div>

          {/* PROGRESS BAR */}
          <div className="px-6 pt-6 flex justify-between items-center">
            <p className="text-sm font-medium text-[var(--text-secondary)] opacity-70">
                Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
            <div className="flex-1 max-w-xs ml-auto bg-[var(--text-primary)]/10 rounded-full h-2">
                <div 
                    className="bg-[var(--blue-primary)] h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} 
                />
            </div>
          </div>

          {/* CARD */}
          <div className="pb-5 px-5 pt-3 border-b border-[var(--text-primary)]/20">
              {currentQuestion && (
                <QuestionCard 
                    key={currentQuestion.id}
                    questionData={currentQuestion}
                    questionIndex={currentQuestionIndex + 1}
                    selectedAnswers={quizState.answers[currentQuestion.id] || []}
                    onSelect={handleAnswerSelect}
                    isDisabled={isCurrentQuestionSubmitted}
                    theme={userPrefs.theme}
                    hintText={currentQuestion.pre_hint}
                    aiHint={quizState.aiHints?.[currentQuestion.id] || null}
                    isHintVisible={isHintVisible}
                />
              )}
          </div>

          {/* FOOTER */}
          <div className="p-5">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={handleShowHint}
                        className="px-5 py-2.5 bg-[var(--hint-button-yellow)] text-black rounded-lg font-semibold flex items-center space-x-2 hover:brightness-110 transition"
                        disabled={!currentQuestion?.pre_hint}
                    >
                        <img src={hintLogoButton} alt="Hint" className="w-5 h-5" />
                        <span className="text-[color:var(--text-light-primary)]">Petunjuk</span>
                    </button>
                    {isLastQuestion && isAllQuestionsChecked && (
                        <button onClick={handleViewScore} className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:brightness-110 transition">
                            Lihat Skor
                        </button>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={handlePrev} disabled={isFirstQuestion || isLoading} className={secondaryBtn}>&lt; Sebelumnya</button>
                    <button onClick={handleNext} disabled={isLastQuestion || isLoading} className={secondaryBtn}>Selanjutnya &gt;</button>
                    {MainActionButton}
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}