// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-adb9f.firebaseapp.com",
  projectId: "mern-auth-adb9f",
  storageBucket: "mern-auth-adb9f.appspot.com",
  messagingSenderId: "713603419482",
  appId: "1:713603419482:web:75fb02c11af1c08bce7763"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);