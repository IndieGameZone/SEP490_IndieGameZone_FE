import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAl1J3GlP4IBdp_lwZ4_nOyi0zCo1c6Voc",
  authDomain: "indiegamezone-e6943.firebaseapp.com",
  projectId: "indiegamezone-e6943",
  storageBucket: "indiegamezone-e6943.firebasestorage.app",
  messagingSenderId: "121649850607",
  appId: "1:121649850607:web:09e6d9b10cd5f6e1ad531a"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();


export { storage,googleProvider,auth };



