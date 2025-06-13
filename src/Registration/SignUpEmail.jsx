import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import target from "../assets/target.png";

export default function SignUpEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
  e.preventDefault(); 

  if (!name || !email || !password) {
    setError("Please fill in all fields!");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters long!");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate("/todo/today");
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      setError("This email is already registered!");
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
            href="/signin"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Sign In
          </a>
        </div>
      </div>

      <form
        onSubmit={handleSignUp}
        className="mt-16 sm:mt-28 border border-gray-300 p-6 sm:p-8 max-w-lg mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-semibold">Sign Up</h2>
        <p className="text-sm mb-4 sm:mb-6 mt-2">
          Create a new account with your email and password.
        </p>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

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
          Sign Up
        </button>
      </form>
    </div>
  );
}
