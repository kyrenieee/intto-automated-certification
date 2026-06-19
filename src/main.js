import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import './assets/main.css'

import { createApp } from 'vue'
import App from './assets/App.vue/index.js'
import LiquidGlass from '@wxperia/liquid-glass-vue'


createApp(App).mount('#app')

const firebaseConfig = {
  apiKey: "AIzaSyDWVm1dTAa0Uu_e3_AIw6dh0F5b4fEFhmc",
  authDomain: "autocert-38ccd.firebaseapp.com",
  projectId: "autocert-38ccd",
  storageBucket: "autocert-38ccd.firebasestorage.app",
  messagingSenderId: "278595522697",
  appId: "1:278595522697:web:152576d7c6de71b0c33658",
  measurementId: "G-E0N0GVFRJL"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const app = createApp(App)
app.use(LiquidGlass)
app.mount('#app')