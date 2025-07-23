// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyAQL2WoAvtDMBjuM-JilDLGS4xUrGm1ExQ",
  authDomain: "ecommersapp-f901f.firebaseapp.com",
  projectId: "ecommersapp-f901f",
  storageBucket: "ecommersapp-f901f.firebasestorage.app",
  messagingSenderId: "203061338614",
  appId: "1:203061338614:web:91b725b5d154b640f867d7",
  measurementId: "G-51Q56VK7CG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
