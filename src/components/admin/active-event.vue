<script setup>
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
</script>

<template >
  
  <header >

  </header>

  <main>
        <h1>Active Event</h1>
  </main>
</template>
