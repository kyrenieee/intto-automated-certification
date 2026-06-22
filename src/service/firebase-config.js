import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  authDomain: "autocert-38ccd.firebaseapp.com",
  projectId: "autocert-38ccd",
  storageBucket: "autocert-38ccd.firebasestorage.app",
  messagingSenderId: "278595522697",
  appId: "1:278595522697:web:152576d7c6de71b0c33658",
  measurementId: "G-E0N0GVFRJL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db }; //can be accessed in other files by importing { db } from './firebase-config.js'


