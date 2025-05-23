import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName, setEmail } from "../Redux/userSlice";
import NotificationBox from "./NotificationBox";
import target from "../assets/target.png";

export default function SignInEmail() {
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch(setName(user.displayName || email.split("@")[0] || "User"));
      dispatch(setEmail(user.email));
      setMessage("Muvaffaqiyatli kirdingiz!");
      setMessageType("success");
      setTimeout(() => navigate("/todo/today"), 2000);
    } catch (error) {
      console.error("Sign-in error:", error.code, error.message);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setMessage(
          "Noto‘g‘ri email yoki parol. Iltimos, qaytadan urinib ko‘ring."
        );
        setMessageType("error");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Noto‘g‘ri email formati!");
        setMessageType("error");
      } else {
        setMessage("Kirishda xatolik: " + error.message);
        setMessageType("error");
      }
    }
  };

  const handlePasswordlessSignIn = async () => {
    try {
      const redirectUrl =
        import.meta.env.VITE_REDIRECT_URL ||
        "http://localhost:5173/finish-sign-up";
      console.log("ActionCodeSettings URL:", redirectUrl);
      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      window.localStorage.setItem(
        "nameForSignIn",
        email.split("@")[0] || "User"
      );
      setMessage(
        "Tasdiqlash havolasi emailingizga yuborildi! Iltimos, emailingizni (shu jumladan Spam jildini) tekshiring."
      );
      setMessageType("success");
    } catch (error) {
      console.error("Passwordless sign-in error:", error.code, error.message);
      if (error.code === "auth/invalid-email") {
        setMessage("Noto‘g‘ri email formati!");
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
          Welcome back! Enter your details to sign in.
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

          <div className="flex flex-col text-center space-y-2">
            <button
              onClick={handleSignIn}
              className="bg-black text-white w-full sm:w-auto px-8 py-2 rounded hover:bg-gray-700"
            >
              Sign In
            </button>
            <button
              onClick={handlePasswordlessSignIn}
              className="bg-gray-600 text-white w-full sm:w-auto px-8 py-2 rounded hover:bg-gray-700"
            >
              Parolsiz kirish (Email havolasi)
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
