import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName, setEmail } from "../Redux/userSlice";
import NotificationBox from "./NotificationBox";

export default function FinishSignUp() {
  const [message, setMessage] = useState(
    "Emaildagi havolani tasdiqlash jarayonida..."
  );
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        let name = window.localStorage.getItem("nameForSignIn") || "User";
        if (!email) {
          email = window.prompt(
            "Iltimos, emailingizni kiriting (emailingizni tekshiring):"
          );
          if (!email) {
            setMessage("Email kiritilmadi. Iltimos, qaytadan urinib ko‘ring.");
            setMessageType("error");
            setTimeout(() => navigate("/signup"), 3000);
            return;
          }
        }
        try {
          const result = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          );
          const user = result.user;
          if (!user.emailVerified) {
            setMessage(
              "Email tasdiqlanmagan. Iltimos, tasdiqlash havolasini tekshiring."
            );
            setMessageType("error");
            return;
          }
          dispatch(setName(name));
          dispatch(setEmail(email));
          window.localStorage.removeItem("emailForSignIn");
          window.localStorage.removeItem("nameForSignIn");
          setMessage("Muvaffaqiyatli ro‘yxatdan o‘tdingiz!");
          setMessageType("success");
          setTimeout(() => navigate("/todo/today"), 2000);
        } catch (error) {
          console.error("Sign-in error:", error.code, error.message);
          if (error.code === "auth/invalid-email") {
            setMessage("Noto‘g‘ri email formati!");
          } else if (error.code === "auth/invalid-action-code") {
            setMessage("Noto‘g‘ri yoki eskirgan tasdiqlash havolasi.");
          } else {
            setMessage("Xatolik: " + error.message);
          }
          setMessageType("error");
          setTimeout(() => navigate("/signup"), 3000);
        }
      } else {
        setMessage(
          "Noto‘g‘ri tasdiqlash havolasi. Iltimos, qaytadan urinib ko‘ring."
        );
        setMessageType("error");
        setTimeout(() => navigate("/signup"), 3000);
      }
    };
    handleEmailLinkSignIn();
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white border border-gray-300 p-6 sm:p-8 max-w-lg mx-auto rounded-md shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Tasdiqlash
        </h2>
        <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>
        <NotificationBox
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />
      </div>
    </div>
  );
}
