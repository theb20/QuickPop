import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrJZS_Ci-H7QejWTY4ZBN5c0BcIFpFP50",
  authDomain: "quick-pop.firebaseapp.com",
  projectId: "quick-pop",
  storageBucket: "quick-pop.firebasestorage.app",
  messagingSenderId: "554931912522",
  appId: "1:554931912522:web:18418590b15b92af4b8bb3",
  measurementId: "G-16CSBMF24B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
