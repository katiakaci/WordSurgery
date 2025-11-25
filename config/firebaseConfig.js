import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfBD8dtZg55GtfgoCOgzH8Hd8P3KyT-dQ",
    authDomain: "wordsurgery-game.firebaseapp.com",
    projectId: "wordsurgery-game",
    storageBucket: "wordsurgery-game.firebasestorage.app",
    messagingSenderId: "326512579548",
    appId: "1:326512579548:web:640b15f136d134d2a57519"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Export a flag to check if Firebase is configured
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";
