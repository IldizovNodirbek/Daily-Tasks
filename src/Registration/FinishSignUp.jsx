import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName, setEmail } from "../Redux/userSlice";
import NotificationBox from "./NotificationBox";

export default function FinishSignUp() {
  const [message, setMessage] = useState(
    "In the process of verifying the link in the email..."
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
            "Please enter your email (check your email):"
          );
          if (!email) {
            setMessage("Email not entered. Please try again.");
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
          dispatch(setName(name));
          dispatch(setEmail(email));
          window.localStorage.removeItem("emailForSignIn");
          window.localStorage.removeItem("nameForSignIn");
          setMessage("You are successfully logged in! Forwarding...");
          setMessageType("success");
          setTimeout(() => navigate("/todo/today"), 2000);
        } catch (error) {
          setMessage("Error: " + error.message);
          setMessageType("error");
          setTimeout(() => navigate("/signup"), 3000);
        }
      } else {
        setMessage(
          "Invalid verification link. Please try again."
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
          Confirmation
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
