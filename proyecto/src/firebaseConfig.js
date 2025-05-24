import { initializeApp } from 'firebase/app'; 
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; 
const firebaseConfig = { 
 apiKey: "AIzaSyBsO5YkmJV-HRNyV8sTkUdYMFcm39jwsiY",
  authDomain: "pokeapi2-37992.firebaseapp.com",
  projectId: "pokeapi2-37992",
  storageBucket: "pokeapi2-37992.firebasestorage.app",
  messagingSenderId: "901790018781",
  appId: "1:901790018781:web:9bc674b4c17f6d96eabf34"
 
}; 
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app); 
const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db }; 
