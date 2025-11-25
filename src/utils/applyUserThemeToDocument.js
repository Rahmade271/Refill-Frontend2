// ===============================================
// applyUserThemeToDocument.js (FINAL, PRODUCTION READY)
// ===============================================
//
// Tugas:
// 1. Pasang <html data-user-theme="user-1">
// 2. Pasang <html data-theme="dark">
// 3. Biarkan index.css mengatur semua warna & font
// 4. Hanya override fontSize & layout jika perlu
// ===============================================

export function applyUserThemeToDocument(userPrefs) {
  if (!userPrefs) return;

  const root = document.documentElement;

  // ===============================
  // 1. Tentukan user-X dari prefs
  // ===============================
  function mapPrefsToUserKey(theme, fontStyle) {
    if (theme === "dark" && fontStyle === "default") return "user-1";
    if (theme === "light" && fontStyle === "default") return "user-2";
    if (theme === "dark" && fontStyle === "serif") return "user-3";
    if (theme === "light" && fontStyle === "serif") return "user-4";
    if (theme === "dark" && fontStyle === "mono") return "user-5";
    if (theme === "light" && fontStyle === "mono") return "user-6";

    return "user-2"; // fallback safe
  }

  const userThemeKey =
    userPrefs.userThemeKey ||
    mapPrefsToUserKey(userPrefs.theme, userPrefs.fontStyle);

  // ===============================
  // 2. Apply data-user-theme
  // ===============================
  root.setAttribute("data-user-theme", userThemeKey);

  // ===============================
  // 3. Apply data-theme (dark/light)
  // ===============================
  if (userPrefs.theme) {
    root.setAttribute("data-theme", userPrefs.theme);
  }

  // ===============================
  // 4. Override font-size (opsional)
  // ===============================
  const fontSizeMap = {
    small: "0.875rem", // 14px
    medium: "1rem", // 16px
    large: "1.125rem", // 18px
  };

  if (userPrefs.fontSize) {
    root.style.setProperty(
      "--font-size-content",
      fontSizeMap[userPrefs.fontSize]
    );
  }

  // ===============================
  // 5. Override layout width (opsional)
  // ===============================
  const layoutWidthMap = {
    fullWidth: "900px",
    compact: "600px",
  };

  if (userPrefs.layoutWidth) {
    root.style.setProperty(
      "--max-width-content",
      layoutWidthMap[userPrefs.layoutWidth]
    );
  }

  console.log(
    "%c[THEME APPLIED]",
    "color:#00c853;font-weight:bold;",
    "userTheme =", userThemeKey,
    "| mode =", userPrefs.theme,
    "| font =", userPrefs.fontStyle,
    "| fontSize =", userPrefs.fontSize,
    "| layout =", userPrefs.layoutWidth
  );
}
