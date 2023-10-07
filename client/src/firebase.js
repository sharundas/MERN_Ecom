// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-b287b.firebaseapp.com",
  projectId: "mern-real-estate-b287b",
  storageBucket: "mern-real-estate-b287b.appspot.com",
  messagingSenderId: "1054851056408",
  appId: "1:1054851056408:web:3ab0fb6858a9ecd823946d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);