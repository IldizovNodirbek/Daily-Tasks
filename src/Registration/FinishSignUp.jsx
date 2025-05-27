import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setName, setEmail } from "../Redux/userSlice";
import NotificationBox from "./NotificationBox";

export default function FinishSignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("Havola tasdiqlanmoqda...");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    const handleSignInWithLink = async () => {
      // Tekshirish: URL tasdiqlash havolasi ekanligini aniqlash
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        setMessage("Noto‘g‘ri tasdiqlash havolasi!");
        setMessageType("error");
        setTimeout(() => navigate("/signin"), 3000);
        return;
      }

      // localStorage dan email va name olish
      const email = window.localStorage.getItem("emailForSignIn");
      const name = window.localStorage.getItem("nameForSignIn");

      if (!email) {
        setMessage("Email topilmadi! Iltimos, qaytadan ro‘yxatdan o‘ting.");
        setMessageType("error");
        setTimeout(() => navigate("/signup"), 3000);
        return;
      }

      try {
        console.log("FinishSignUp: Attempting to sign in with email link", {
          email,
          name,
        });
        const result = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        const user = result.user;

        // Redux ga ma'lumotlarni yozish
        dispatch(setName(name || email.split("@")[0] || "User"));
        dispatch(setEmail(user.email));

        // localStorage ni tozalash
        window.localStorage.removeItem("emailForSignIn");
        window.localStorage.removeItem("nameForSignIn");

        setMessage("Havola muvaffaqiyatli tasdiqlandi! Tizimga kiryapsiz...");
        setMessageType("success");
        console.log(
          "FinishSignUp: Sign-in successful, navigating to /todo/today"
        );
        setTimeout(() => navigate("/todo/today"), 2000);
      } catch (error) {
        console.error("FinishSignUp error:", error.code, error.message);
        setMessage(`Xatolik yuz berdi: ${error.message}`);
        setMessageType("error");
        setTimeout(() => navigate("/signin"), 3000);
      }
    };

    handleSignInWithLink();
  }, [navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <NotificationBox
        message={message}
        type={messageType}
        onClose={() => {}}
      />
    </div>
  );
}
