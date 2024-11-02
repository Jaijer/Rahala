import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Secret api key
  authDomain: "rahala-s2021.firebaseapp.com",
  projectId: "rahala-s2021",
  storageBucket: "rahala-s2021.firebasestorage.app",
  messagingSenderId: "1080112929528",
  appId: "1:1080112929528:web:3fcf5c1790701967c9b90d",
  measurementId: "G-F1R3ME6Y95",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
