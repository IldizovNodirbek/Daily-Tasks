import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName, setEmail } from "../Redux/userSlice";

export default function SignInEmail() {
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
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
      alert("Muvaffaqiyatli kirdingiz!");
      navigate("/todo/today");
    } catch (error) {
      console.error("Sign-in error:", error.code, error.message);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Noto‘g‘ri email yoki parol. Iltimos, qaytadan urinib ko‘ring.");
      } else if (error.code === "auth/invalid-email") {
        alert("Noto‘g‘ri email formati!");
      } else {
        alert("Kirishda xatolik: " + error.message);
      }
    }
  };

  const handlePasswordlessSignIn = async () => {
    try {
      const actionCodeSettings = {
        url:
          import.meta.env.VITE_REDIRECT_URL ||
          "http://localhost:5173/finish-sign-up",
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      window.localStorage.setItem(
        "nameForSignIn",
        email.split("@")[0] || "User"
      );
      alert(
        "Tasdiqlash havolasi emailingizga yuborildi! Iltimos, emailingizni (shu jumladan Spam jildini) tekshiring."
      );
    } catch (error) {
      console.error("Passwordless sign-in error:", error.code, error.message);
      if (error.code === "auth/invalid-email") {
        alert("Noto‘g‘ri email formati!");
      } else {
        alert("Xatolik: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">Email orqali kirish</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmailInput(e.target.value)}
        placeholder="Email kiriting (masalan, john@gmail.com)"
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Parol kiriting"
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
      />
      <button
        onClick={handleSignIn}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
      >
        Kirish
      </button>
      <button
        onClick={handlePasswordlessSignIn}
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
      >
        Parolsiz kirish (Email havolasi)
      </button>
      <p className="mt-2 text-sm text-gray-600">
        Hisobingiz yo‘qmi?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Ro‘yxatdan o‘ting
        </a>
      </p>
    </div>
  );
}
