import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import target from "../assets/target.png";

export default function SignInEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Fill in your email and password!");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/todo/today");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("User not found!");
      } else if (err.code === "auth/wrong-password") {
        setError("Password is incorrect!");
      } else {
        setError("Error: " + err.message);
      }
    }
  };

  return (
    <div className="border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="flex items-center mb-6 sm:mb-0">
          <img src={target} alt="arrow" className="w-[40px] h-[40px]" />
          <h1 className="text-2xl sm:text-3xl ml-4 font-bold">Daily Tasks</h1>
        </div>
        <div className="flex ml-auto">
          <a
            href="/signup"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Sign Up
          </a>
        </div>
      </div>

      <form
        onSubmit={handleSignIn}
        className="mt-16 sm:mt-28 border border-gray-300 p-6 sm:p-8 max-w-lg mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-semibold">Sign In</h2>
        <p className="text-sm mb-4 sm:mb-6 mt-2">
          Welcome back! Enter your email to sign in.
        </p>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white w-full px-8 py-2 rounded hover:bg-gray-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
