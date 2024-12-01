import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "your-asian-mom.firebaseapp.com",
  projectId: "your-asian-mom",
  storageBucket: "your-asian-mom.appspot.com",
  messagingSenderId: "924509293050",
  appId: "1:924509293050:web:0d794327db675bbc093c43",
  measurementId: "G-0N014GC2QY",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
let analytics;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { db, analytics };
