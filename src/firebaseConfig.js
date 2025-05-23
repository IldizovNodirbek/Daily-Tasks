// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSiCSFBIY94C1fL2_MEL_MbOpNySfY2vg",
  authDomain: "daily-task-7703e.firebaseapp.com",
  projectId: "daily-task-7703e",
  storageBucket: "daily-task-7703e.firebasestorage.app",
  messagingSenderId: "719940823556",
  appId: "1:719940823556:web:515cf7712fe585230b6351",
  measurementId: "G-CKK2TXE7XR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
