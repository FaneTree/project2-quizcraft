import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "quizcraft-c8706.firebaseapp.com",
  projectId: "quizcraft-c8706",
  storageBucket: "quizcraft-c8706.appspot.com",
  messagingSenderId: "202630272074",
  appId: "1:202630272074:web:34c1b961884b89568342b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const db = getFirestore(app);

export const provider = new GoogleAuthProvider();
export const usersRef = collection(db, "users");

// Initialize Firebase Authentication and get a reference to the service
export { auth, database, db };