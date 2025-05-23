import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, sendSignInLinkToEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName, setEmail } from "../Redux/userSlice";

export default function SignUpEmail() {
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [name, setNameInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    try {
      // Foydalanuvchini ro‘yxatdan o‘tkazish
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Redux’ga ma'lumotlarni saqlash
      dispatch(setName(name || email.split("@")[0] || "User"));
      dispatch(setEmail(user.email));

      // Email tasdiqlash havolasini yuborish
      const actionCodeSettings = {
        url: import.meta.env.VITE_REDIRECT_URL || "http://localhost:5173/finish-sign-up",
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert("Tasdiqlash havolasi emailingizga yuborildi! Iltimos, emailingizni (shu jumladan Spam jildini) tekshiring.");
      window.localStorage.setItem("emailForSignIn", email);
      window.localStorage.setItem("nameForSignIn", name || email.split("@")[0] || "User");
    } catch (error) {
      console.error("Sign-up error:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("Bu email allaqachon ro‘yxatdan o‘tgan. Iltimos, /signin sahifasidan tizimga kiring.");
        navigate("/signin");
      } else if (error.code === "auth/invalid-email") {
        alert("Noto‘g‘ri email formati!");
      } else if (error.code === "auth/weak-password") {
        alert("Parol kamida 6 belgi bo‘lishi kerak!");
      } else {
        alert("Xatolik: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold mb-4">Email orqali ro'yxatdan o'tish</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Ismingizni kiriting (masalan, John201)"
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
      />
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
        onClick={handleSignUp}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Ro'yxatdan o'tish
      </button>
      <p className="mt-2 text-sm text-gray-600">
        Allaqachon hisobingiz bormi?{" "}
        <a href="/signin" className="text-blue-600 hover:underline">
          Tizimga kiring
        </a>
      </p>
    </div>
  );
}