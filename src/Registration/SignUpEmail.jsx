import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { sendSignInLinkToEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import NotificationBox from "./NotificationBox";
import target from "../assets/target.png";

export default function SignUpEmail() {
  const [email, setEmailInput] = useState("");
  const [name, setNameInput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name.trim()) {
      setMessage("Please enter your name or nickname!");
      setMessageType("error");
      return;
    }
    if (!email.trim()) {
      setMessage("Please, Enter your email!");
      setMessageType("error");
      return;
    }
    try {
      // Check if email is already registered
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods && methods.length > 0) {
        setMessage("This email is already registered. Please sign in from /signin.");
        setMessageType("error");
        setTimeout(() => navigate("/signin"), 3000);
        return;
      }
      const redirectUrl =
        import.meta.env.VITE_REDIRECT_URL ||
        "http://localhost:5173/finish-sign-up";
      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setMessage(
        "A confirmation link has been sent to your email! Please check your email (including your Spam folder)."
      );
      setMessageType("success");
      window.localStorage.setItem("emailForSignIn", email);
      window.localStorage.setItem("nameForSignIn", name);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setMessage(
          "This email is already registered. Please sign in from /signin."
        );
        setMessageType("error");
        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setMessage("Error: " + error.message);
        setMessageType("error");
      }
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
            href="/signin"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Sign In
          </a>
        </div>
      </div>

      <div className="mt-16 sm:mt-28 border border-gray-300 p-6 sm:p-8 max-w-lg mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold">Sign Up</h2>
        <p className="text-sm mb-4 sm:mb-6 mt-2">
          Nice to meet you! Enter your details to register.
        </p>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Nickname
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name or nickname"
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col text-center">
            <button
              onClick={handleSignUp}
              className="bg-black text-white w-full sm:w-auto px-8 py-2 rounded hover:bg-gray-700"
            >
              Sign Up
            </button>
            <a href="/signin" className="mt-2 text-blue-600 hover:underline">
              Already have an account?
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
