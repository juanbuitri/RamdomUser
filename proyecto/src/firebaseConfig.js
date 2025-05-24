import { initializeApp } from 'firebase/app'; 
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; 
const firebaseConfig = { 
 apiKey: "aqui su codigo", 
 authDomain: "aqui su codigo", 
 projectId: "aqui su codigo", 
 storageBucket: "aqui su codigo", 
 messagingSenderId: "aqui su codigo", 
 appId: "aqui su codigo" 
}; 
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app); 
const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db }; 
