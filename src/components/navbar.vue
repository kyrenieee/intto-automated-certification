<script setup>
//for imports only
import { RouterLink } from "vue-router";
</script>
<!-- zai -->

<template>
  <header class="sticky top-0 z-50 w-full">
    <nav class="w-full mx-auto flex justify-between items-center h-20 px-6 text-white">
      <!-- logo holder-->
      <div class="flex items-center">
        <RouterLink to="/dashboard">
          <div
            class="bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-full p-2.5 flex items-center justify-center"
          >
            <img
              src="../assets/inttologo.svg"
              alt="Intto Logo"
              class="w-10 h-auto object-contain brightness-[1.2]"
            />
          </div>
        </RouterLink>
      </div>

      <!-- nav links -->
      <div class="flex items-center">
        <div
          class="h-11 bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-full px-2 py-1.5 flex items-center space-x-1"
        >
          <RouterLink
            to="/dashboard"
            active-class="bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            class="hover:bg-white/15 text-white/80 text-sm font-poppins px-3 py-1 rounded-full transition-all duration-200"
            >Home</RouterLink
          >

          <RouterLink
            to="/events"
            active-class="bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            class="hover:bg-white/15 text-white/80 text-sm font-poppins px-3 py-1 rounded-full transition-all duration-200"
            >Events</RouterLink
          >

          <RouterLink
            to="/settings"
            active-class="bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            class="hover:bg-white/15 text-white/80 text-sm font-poppins px-3 py-1 rounded-full transition-all duration-200"
            >Settings</RouterLink
          >

          <RouterLink
            to="/eventcal"
            active-class="bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            class="hover:bg-white/15 text-white/80 text-sm font-poppins px-3 py-1 rounded-full transition-all duration-200"
            >Add Event</RouterLink
          >
        </div>
      </div>

      <!-- profile avatar -->
      <div class="flex items-center">
        <RouterLink to="/settings">
          <div
            class="bg-gray-600/40 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm tracking-wide"
          >
            UC
          </div>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
