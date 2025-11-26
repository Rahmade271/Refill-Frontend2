import React from "react";
import QuizContainer from "./components/QuizContainer";
// Hapus import applyUserThemeToDocument karena App.jsx tidak boleh mengatur tema global

export default function App() {
  // Hapus useEffect yang memaksa theme light.
  // Biarkan QuizContainer yang mengatur tema berdasarkan user yang aktif.

  return (
    <div className="min-h-screen">
      <QuizContainer />
    </div>
  );
}