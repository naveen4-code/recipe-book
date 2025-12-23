import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDzw5h4UCRFi5lVvs0VJtFAQ-QwZOL_83I",
  authDomain: "recipe-book-9e89a.firebaseapp.com",
  projectId: "recipe-book-9e89a",
  storageBucket: "recipe-book-9e89a.firebasestorage.app",
  messagingSenderId: "1034880819826",
  appId: "1:1034880819826:web:22fc2221024b751c9358eb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);