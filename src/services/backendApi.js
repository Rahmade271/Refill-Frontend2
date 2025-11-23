// ================================
// BACKEND API SERVICE (WITH MOCK FALLBACK)
// ================================

import { MOCK_QUIZ_DATA } from "../mock/quizData"; 
import { MOCK_USER_PREFS } from "../mock/userPrefs"; 
// pastikan path sesuai

//const QUIZ_GENERATE_URL = "http://localhost:3001/quiz/generate";
//const HINT_GENERATE_URL = "http://localhost:3002/hint/generate";

const BASE_BE_URL = "https://refill-backend2-production.up.railway.app"; // <-- Sesuaikan dengan URL Railway kamu

const QUIZ_GENERATE_URL = `${BASE_BE_URL}/quiz/generate`;
const HINT_GENERATE_URL = `${BASE_BE_URL}/hint/generate`; // (Jika hint sudah dideploy, jika belum biarkan atau arahkan ke BE utama kalau digabung)


// ==========================================
// FETCH QUIZ + PREFS (WITH FALLBACK)
// ==========================================
export const fetchQuizDataAndPrefs = async (tutorialId, userId) => {
  console.log(`[API] Fetching quiz for tutorial=${tutorialId}, user=${userId}`);

  try {
    const response = await fetch(QUIZ_GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorial_id: tutorialId, user_id: userId }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();

    return {
      questions: json.questions,
      userPreferences: {
        theme: json.userPreferences.theme,
        fontStyle: json.userPreferences.fontStyle,
        fontSize: json.userPreferences.fontSize,
        layoutWidth: json.userPreferences.layoutWidth,
      },
      tutorialId: json.metadata.tutorialId,
      userId: json.metadata.userId,
    };
  } catch (err) {
    console.error("❌ Backend gagal. Menggunakan MOCK.", err);

    // Fallback ke mock
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

// ==========================================
// FETCH AI HINT (WITH FALLBACK)
// ==========================================
export const generateHintAI = async (tutorialId, questionText) => {
  try {
    const response = await fetch(HINT_GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorial_id: tutorialId, question: questionText }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    return json.data.hint;
  } catch (err) {
    console.error("❌ AI Hint gagal. Menggunakan MOCK hint.", err);

    return "Hint tidak tersedia karena koneksi ke server gagal.";
  }
};
