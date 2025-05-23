import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Main/HomePage";
import TodoPage from "./UserProfile/TodoPage";
import SignInEmail from "./Registration/SignInEmail";
import SignUpEmail from "./Registration/SignUpEmail";
import FinishSignUp from "./Registration/FinishSignUp";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInEmail />} />
        <Route path="/signup" element={<SignUpEmail />} />
        <Route path="/todo/*" element={<TodoPage />} />
        <Route path="/finish-sign-up" element={<FinishSignUp />} />
      </Routes>
    </div>
  );
};

export default App;
