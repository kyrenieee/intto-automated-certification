<script setup>
//for imports only
import { LiquidGlass } from "@wxperia/liquid-glass-vue";
import { RouterLink, RouterView } from "vue-router";
</script>
<!-- zai -->

<template>
  <header class="sticky top-0 z-50 w-full ">
  <nav class="w-full max-w-5xl mx-auto flex justify-between items-center h-20 px-6 text-white">
    
    <!-- logo holder-->
    <div class="flex items-center">
      <RouterLink to="/dashboard">
        <div class="bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-full p-2.5 flex items-center justify-center">
          <img src="../assets/inttologo.svg" alt="Intto Logo" class="w-10 h-auto object-contain brightness-[1.2]" />
        </div>
        </RouterLink>
    </div>

    <!-- nav links -->
    <div class="flex items-center">
      <div class="bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-full px-2 py-1.5 flex items-center space-x-1">
        <RouterLink
          to="/dashboard"
          class="hover:bg-white/15 active:bg-white/30 text-white text-sm font-poppins px-5 py-2 rounded-full transition-all duration-200"
          >Home</RouterLink
        >
        <RouterLink
          to="/active"
          class="hover:bg-white/15 active:bg-white/30 text-white text-sm font-poppins px-5 py-2 rounded-full transition-all duration-200"
          >Events</RouterLink
        >
        <RouterLink
          to="/settings"
          class="hover:bg-white/15 active:bg-white/30 text-white text-sm font-poppins px-5 py-2 rounded-full transition-all duration-200"
          >Settings</RouterLink
        >
        <RouterLink
          to="/eventcal"
          class="hover:bg-white/15 active:bg-white/30 text-white text-sm font-poppins px-5 py-2 rounded-full transition-all duration-200"
          >Add Event</RouterLink
        >
      </div>
    </div>

    <!-- profile avatar -->
    <div class="flex items-center">
      <RouterLink to="/settings">
        <div class="bg-gray-600/40 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-sm tracking-wide">
          UC
        </div>
      </RouterLink>
    </div>

  </nav>
  </header>
</template>
