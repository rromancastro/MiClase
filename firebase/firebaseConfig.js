// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTvDJsoFFn0bandp7ZK_pdI4lrx5yiznc",
  authDomain: "miclase-30e23.firebaseapp.com",
  projectId: "miclase-30e23",
  storageBucket: "miclase-30e23.firebasestorage.app",
  messagingSenderId: "689569498562",
  appId: "1:689569498562:web:3e7fcfb8c2e1fb61d4025b",
  measurementId: "G-Q8XJZEPQ8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };