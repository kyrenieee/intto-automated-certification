<script>
</script>

<template>
    <main class="min-h-screen bg-[#1C2D27] p-3 font-poppins">
    <section class="ml-auto flex flex-col mb-6 gap-10 justify-items-center">
        <div class="flex space-x-3">
        <RouterLink to="/eventsall" class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">All Events</RouterLink>
        <RouterLink to="/eventsactive" class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">Active</RouterLink>
        <RouterLink to="/eventsactive" class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">Completed</RouterLink>
        <RouterLink to="/allevent" class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">Upcoming</RouterLink>
    </div>
        <div class="flex space-x-3 relative">
            <div class="relative w-64 md:w-80 ml-auto flex">
                 <input type="text" placeholder="Search" class="justify-items-endw-full bg-[#32423b] text-white text-sm px-10 py-2.5 rounded-full border border-gray-600 focus:outline-none focus:border-[#4d6b5f]">
            </div>
        </div>
        <div>

        </div>
        <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]">card</div>    
    </section>
    </main>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style scoped>
</style>
<!-- <script setup>
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDWVm1dTAa0Uu_e3_AIw6dh0F5b4fEFhmc",
//   authDomain: "autocert-38ccd.firebaseapp.com", 
//   projectId: "autocert-38ccd",
//   storageBucket: "autocert-38ccd.firebasestorage.app",
//   messagingSenderId: "278595522697",
//   appId: "1:278595522697:web:152576d7c6de71b0c33658",
//   measurementId: "G-E0N0GVFRJL"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// </script>

// <template >
  
//   <header >

//   </header>

//   <main>
//         <h1>Active Event</h1>
//   </main>
// </template> -->
