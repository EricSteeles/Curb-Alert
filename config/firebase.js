// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzdP1uMQq438glEkZOiAJ1Ha_zuHXRDIo",
  authDomain: "curb-alert-free-stuff.firebaseapp.com",
  projectId: "curb-alert-free-stuff",
  storageBucket: "curb-alert-free-stuff.firebasestorage.app",
  messagingSenderId: "1094100953016",
  appId: "1:1094100953016:web:5241965be22057e7a3114d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;