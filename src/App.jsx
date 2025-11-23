import React, { useEffect } from "react";
import QuizContainer from "./components/QuizContainer";
import { applyUserThemeToDocument } from "./utils/applyUserThemeToDocument";

export default function App() {
  // ===============================
  // DEFAULT THEME → supaya WelcomeScreen tidak putih
  // ===============================
  useEffect(() => {
    applyUserThemeToDocument({
      theme: "light",
      fontStyle: "default",
      fontSize: "medium",
      layoutWidth: "fullWidth",
      userThemeKey: "user-2", // default safe light theme
    });
  }, []);

  return (
    <div className="min-h-screen">
      <QuizContainer />
    </div>
  );
}
