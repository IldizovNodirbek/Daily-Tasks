import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName, setEmail } from "../Redux/userSlice";
import NotificationBox from "./NotificationBox";
import target from "../assets/target.png";

export default function SignUpEmail() {
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [name, setNameInput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    if (!name.trim()) {
      setMessage("Iltimos, ismingizni kiriting!");
      setMessageType("error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch(setName(name)); //
      dispatch(setEmail(user.email)); //

      const redirectUrl =
        import.meta.env.VITE_SIGNUP_REDIRECT_URL ||
        "http://localhost:5173/finish-sign-up";
      console.log("ActionCodeSettings URL:", redirectUrl);
      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setMessage(
        "Tasdiqlash havolasi emailingizga yuborildi! Iltimos, emailingizni (shu jumladan Spam jildini) tekshiring."
      );
      setMessageType("success");
      window.localStorage.setItem("emailForSignIn", email);
      window.localStorage.setItem("nameForSignIn", name);
    } catch (error) {
      console.error("Sign-up error:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        setMessage(
          "Bu email allaqachon ro‘yxatdan o‘tgan. Iltimos, /signin sahifasidan tizimga kiring."
        );
        setMessageType("error");
        setTimeout(() => navigate("/signin"), 3000);
      } else if (error.code === "auth/invalid-email") {
        setMessage("Noto‘g‘ri email formati!");
        setMessageType("error");
      } else if (error.code === "auth/weak-password") {
        setMessage("Parol kamida 6 belgi bo‘lishi kerak!");
        setMessageType("error");
      } else {
        setMessage("Xatolik: " + error.message);
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
              placeholder="Ismingizni kiriting (masalan, John201)"
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
              placeholder="Email kiriting (masalan, john@gmail.com)"
              className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol kiriting"
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
