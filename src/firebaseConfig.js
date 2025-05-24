// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDw_g_yHf93ke01whUtX9hAue6tfIOr-aI",
  authDomain: "daily-task-2b818.firebaseapp.com",
  projectId: "daily-task-2b818",
  storageBucket: "daily-task-2b818.firebasestorage.app",
  messagingSenderId: "788767915642",
  appId: "1:788767915642:web:abff1e6551c538c37c85c3",
  measurementId: "G-R749ZHPN01"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };


// new connfig 
// const firebaseConfig = {
//   apiKey: "AIzaSyDw_g_yHf93ke01whUtX9hAue6tfIOr-aI",
//   authDomain: "daily-task-2b818.firebaseapp.com",
//   projectId: "daily-task-2b818",
//   storageBucket: "daily-task-2b818.firebasestorage.app",
//   messagingSenderId: "788767915642",
//   appId: "1:788767915642:web:abff1e6551c538c37c85c3",
//   measurementId: "G-R749ZHPN01"
// };


