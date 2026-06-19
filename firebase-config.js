import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDWVm1dTAa0Uu_e3_AIw6dh0F5b4fEFhmc",
  authDomain: "autocert-38ccd.firebaseapp.com",
  projectId: "autocert-38ccd",
  storageBucket: "autocert-38ccd.firebasestorage.app",
  messagingSenderId: "278595522697",
  appId: "1:278595522697:web:152576d7c6de71b0c33658",
  measurementId: "G-E0N0GVFRJL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);