// ===============================================
// applyUserThemeToDocument.js — FINAL VERSION
// Sistem Theme Baru (Tanpa user-1/user-6 mapping)
// ===============================================

export function applyUserThemeToDocument(prefs) {
  if (!prefs) return;

  const root = document.documentElement;

  // 1. THEME (light / dark)
  if (prefs.theme) {
    root.setAttribute("data-theme", prefs.theme);
  }

  // 2. FONT FAMILY (default / serif / open-dyslexic)
  if (prefs.fontStyle) {
    root.setAttribute("data-font", prefs.fontStyle);
  }

  // 3. FONT SIZE (small / medium / large)
  if (prefs.fontSize) {
    root.setAttribute("data-size", prefs.fontSize);
  }

  // 4. LAYOUT WIDTH (fullWidth / mediumWidth)
  if (prefs.layoutWidth) {
    root.setAttribute("data-width", prefs.layoutWidth);
  }

  console.log(
    `%c[THEME APPLIED] theme=${prefs.theme} | font=${prefs.fontStyle} | size=${prefs.fontSize} | width=${prefs.layoutWidth}`,
    "color:#4ade80;font-weight:bold;"
  );
}
