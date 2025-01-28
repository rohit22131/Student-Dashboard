import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentsPage from "./pages/StudentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/students" element={<StudentsPage />} />
    </Routes>
  );
}

export default App;
