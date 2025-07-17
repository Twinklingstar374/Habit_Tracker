// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyACaaqbKaxwa-yHmlg0yMBOkd__NeveJkk",
  authDomain: "trackx-e9fea.firebaseapp.com",
  projectId: "trackx-e9fea",
  storageBucket: "trackx-e9fea.appspot.com", // ✅ corrected `.app` to `.appspot.com`
  messagingSenderId: "744432355474",
  appId: "1:744432355474:web:0173e3482704cabdda3e4b",
  measurementId: "G-3PZG3K91V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // 🔸 Add this line

export { auth, db };  // 🔸 Export Firestore too

