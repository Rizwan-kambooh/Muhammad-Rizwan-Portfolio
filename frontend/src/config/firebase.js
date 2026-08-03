import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase web configuration is public. Database access is protected by
// Firestore Security Rules, not by keeping these identifiers secret.
const firebaseConfig = {
  apiKey: "AIzaSyCxSwfHrDMXbjN1TXLXEmDUO9IZfcSXhpw",
  authDomain: "muhammad-rizwan-portfoli-32b87.firebaseapp.com",
  projectId: "muhammad-rizwan-portfoli-32b87",
  storageBucket: "muhammad-rizwan-portfoli-32b87.firebasestorage.app",
  messagingSenderId: "103799945422",
  appId: "1:103799945422:web:5a2dc1c9fb7c961ddd789f",
  measurementId: "G-754YGM75X0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
