// ================================
// BACKEND API SERVICE (FINAL)
// ================================

//const BASE_BE_URL = "https://backend-acak.ngrok-free.dev"; 

// GANTI DENGAN URL RAILWAY KAMU
const BASE_BE_URL = "https://assessment-generator-production.up.railway.app"; 
const QUIZ_RESET_URL = "https://refill-backend2-production.up.railway.app/quiz/reset";

const QUIZ_GENERATE_URL = `${BASE_BE_URL}/quiz/generate`;
const HINT_GENERATE_URL = "http://localhost:3002/hint/generate";

// Tambahkan konstanta URL
const SUBMIT_SCORE_URL = "http://localhost:3001/quiz/submit";

// ==============================================
// MAP PREFERENCES → USER THEME
// ==============================================
const mapPrefsToUserTheme = (prefs) => {
  const { fontStyle, theme, fontSize } = prefs;

  if (theme === "dark" && fontStyle === "default") return "user-1";
  if (theme === "light" && fontStyle === "default") return "user-2";
  if (theme === "dark" && fontStyle === "serif") return "user-3";
  if (theme === "light" && fontStyle === "serif") return "user-4";
  if (theme === "dark" && fontStyle === "mono") return "user-5";
  if (theme === "light" && fontStyle === "mono") return "user-6";

  return "user-2"; // fallback aman
};

// ==========================================
// FETCH QUIZ + PREFS
// ==========================================
export const fetchQuizDataAndPrefs = async (tutorialId, userId) => {
  console.log(`[API] Fetching quiz for tutorial=${tutorialId}, user=${userId}`);

  const response = await fetch(QUIZ_GENERATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tutorial_id: tutorialId, user_id: userId }),
  });

  if (!response.ok)
    throw new Error(`Gagal generate quiz. HTTP ${response.status}`);

  const json = await response.json();

  const mappedThemeKey = mapPrefsToUserTheme(json.userPreferences);

  return {
    questions: json.questions,
    userPreferences: {
      ...json.userPreferences,
      userThemeKey: mappedThemeKey,
    },
    tutorialId: json.metadata.tutorialId,
    userId: json.metadata.userId,
  };
};

// ==========================================
// FETCH AI HINT
// ==========================================
export const generateHintAI = async (tutorialId, questionText) => {
  const response = await fetch(HINT_GENERATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tutorial_id: tutorialId, question: questionText }),
  });

  if (!response.ok)
    throw new Error(`Gagal generate hint. HTTP ${response.status}`);

  const json = await response.json();
  return json.data.hint;
};

// ==========================================
// SUBMIT SCORE FEATURE
// ==========================================
export const submitQuizScore = async (userId, tutorialId, score, totalQuestions) => {
  try {
    await fetch(SUBMIT_SCORE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, tutorialId, score, totalQuestions }),
    });

    console.log(`[API] Score submitted: user=${userId}, tutorial=${tutorialId}, score=${score}`);

  } catch (err) {
    console.error("Gagal submit skor ke server:", err);
  }
};

// ==========================================
// RESET QUIZ HISTORY (BARU DITAMBAHKAN)
// ==========================================
export const resetQuizHistory = async (tutorialId, userId) => {
  try {
    await fetch(QUIZ_RESET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorial_id: tutorialId, user_id: userId }),
    });

    console.log("[API] History reset successful on backend.");

  } catch (err) {
    console.error("[API] Failed to reset backend history:", err);
    // Jangan throw agar reset lokal tetap jalan
  }
};