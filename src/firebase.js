import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC57dybgYrAuOoBwxIxloUAtibHUBth_hM",
  authDomain: "ecomm-11844.firebaseapp.com",
  projectId: "ecomm-11844",
  storageBucket: "ecomm-11844.firebasestorage.app",
  messagingSenderId: "311161704372",
  appId: "1:311161704372:web:6ee2d1e56a46a4d0c1ace1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { serverTimestamp };
export default app;
