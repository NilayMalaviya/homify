// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homify-150da.firebaseapp.com",
  projectId: "homify-150da",
  storageBucket: "homify-150da.appspot.com",
  messagingSenderId: "1044498217642",
  appId: "1:1044498217642:web:532d325ef6b943d445aed3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);