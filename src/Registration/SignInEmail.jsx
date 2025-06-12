import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import NotificationBox from "./NotificationBox";
import target from "../assets/target.png";

export default function SignInEmail() {
  const [email, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email!");
      setMessageType("error");
      return;
    }
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (!methods || methods.length === 0) {
        setMessage("No such email was found, please register!");
        setMessageType("error");
        return;
      }
      setMessage("You have successfully logged in!");
      setMessageType("success");
      window.localStorage.setItem("emailForSignIn", email);
      setTimeout(() => navigate("/finish-sign-up"), 1500);
    } catch (error) {
      setMessage("Error: " + error.message);
      setMessageType("error");
    }
  };

  return (
    <div className="border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <div className="flex items-center mb-6 sm:mb-0">
          <img
            src={target}
            alt="arrow-svg-photo"
            className="w-[40px] h-[40px]"
          />
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

      <div className="mt-16 sm:mt-28 border border-gray-300 p-6 sm:p-8 max-w-lg mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold">Sign In</h2>
        <p className="text-sm mb-4 sm:mb-6 mt-2">
          Welcome back! Enter your email to sign in.
        </p>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col text-center space-y-2">
            <button
              onClick={handleSignIn}
              className="bg-black text-white w-full sm:w-auto px-8 py-2 rounded hover:bg-gray-700"
            >
              Sign In
            </button>
            <a href="/signup" className="text-blue-600 hover:underline">
              Don’t have an account? Sign up
            </a>
          </div>
        </div>

        <NotificationBox
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />
      </div>
    </div>
  );
}
