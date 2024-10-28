import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAB_TNCWB1fwgaV0WjeW48GplkJng3wiuk",
  authDomain: "trivia-ai-e4a17.firebaseapp.com",
  projectId: "trivia-ai-e4a17",
  storageBucket: "trivia-ai-e4a17.appspot.com",
  messagingSenderId: "838262342607",
  appId: "1:838262342607:web:b235164b2ccf156b2688ba",
  measurementId: "G-NZJJ59L031",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
