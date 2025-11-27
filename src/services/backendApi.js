import { MOCK_QUIZ_DATA } from "../mock/quizData";
import { MOCK_USER_PREFS } from "../mock/userPrefs";

// === KONFIGURASI URL ===
const BASE_BE_URL = "https://refill-backend2-production.up.railway.app";
const HINT_BASE_URL = "https://hint-api-production.up.railway.app";

// URL ASSESSMENT / GENERATOR
const QUIZ_GENERATE_URL = `${BASE_BE_URL}/assessment/quiz/generate`;
const QUIZ_RESET_URL    = `${BASE_BE_URL}/assessment/quiz/reset`;
const QUIZ_SUBMIT_URL   = `${BASE_BE_URL}/assessment/quiz/submit`;

// URL HINT SERVICE
const HINT_GENERATE_URL = `${HINT_BASE_URL}/hint/generate`;


// === GENERATE SOAL ===
export const fetchQuizDataAndPrefs = async (tutorialId, userId) => {
  console.log(`[API] Fetching quiz for tutorial=${tutorialId}, user=${userId}`);

  try {
    const response = await fetch(QUIZ_GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorial_id: tutorialId,
        user_id: userId,
        question_index: 0,
        count: 3
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();

    return {
      questions: json.questions,
      userPreferences: {
        theme: json.userPreferences?.theme || 'light',
        fontStyle: json.userPreferences?.fontStyle || 'default',
        fontSize: json.userPreferences?.fontSize || 'medium',
        layoutWidth: json.userPreferences?.layoutWidth || 'fullWidth',
      },
      metadata: {
        tutorial_id: json.metadata?.tutorial_id,
        user_id: json.metadata?.user_id,
        startIndex: json.metadata?.startIndex,
        count: json.metadata?.count,
        contextText: json.metadata?.contextText,
        moduleTitle: json.metadata?.moduleTitle || "Submodul Pembelajaran"
      }
    };

  } catch (err) {
    console.error("Backend gagal. Menggunakan MOCK.", err);

    return {
      questions: MOCK_QUIZ_DATA,
      userPreferences: {
        theme: MOCK_USER_PREFS.theme,
        fontStyle: MOCK_USER_PREFS.fontStyle,
        fontSize: MOCK_USER_PREFS.fontSize,
        layoutWidth: MOCK_USER_PREFS.layoutWidth,
      },
      tutorialId,
      userId,
    };
  }
};


// === GENERATE HINT ===
export const generateHintAI = async ({
  tutorialId,
  qid,
  question,
  contextText,
  studentAnswer = [],
  options = []
}) => {
  try {
    const response = await fetch(HINT_GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorial_id: tutorialId,
        qid,
        question,
        context_text: contextText,
        student_answer: studentAnswer,
        options
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    return json.hint || json.data?.hint;

  } catch (err) {
    console.error("AI Hint gagal. Menggunakan MOCK hint.", err);
    return "Hint tidak tersedia karena koneksi ke server gagal.";
  }
};


// === RESET PER SOAL ===
export const resetSingleQuestion = async (tutorialId, userId, questionIndex) => {
  const response = await fetch(QUIZ_GENERATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tutorial_id: tutorialId,
      user_id: userId,
      question_index: questionIndex,
      count: 1
    }),
  });

  if (!response.ok) throw new Error("Reset single question failed");

  return await response.json();
};


// === RESET SEMUA SOAL ===
export const resetAllQuestions = async (tutorialId, userId) => {
  try {
    const response = await fetch(QUIZ_RESET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tutorial_id: tutorialId,
        user_id: userId
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();

  } catch (err) {
    console.error("Reset all questions failed:", err);
    throw err;
  }
};
