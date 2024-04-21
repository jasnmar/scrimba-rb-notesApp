import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB1BvQwHUwXhuaBU2jV26hIzl76d2rQ7s",
  authDomain: "react-notes-96e1b.firebaseapp.com",
  projectId: "react-notes-96e1b",
  storageBucket: "react-notes-96e1b.appspot.com",
  messagingSenderId: "918970613324",
  appId: "1:918970613324:web:c47ba56c01d32ff958fee9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")


