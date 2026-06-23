<script setup> //for imports only
import { LiquidGlass } from '@wxperia/liquid-glass-vue';
import { RouterLink, RouterView } from 'vue-router'
</script>

<!-- <template>
<section class="w-full text-white p-4 flex items-center justify-evenly px-15">
    <div class="flex-col items-center justify-stretch bg-white/10 rounded-4xl px-5 py-3">
      <img src="../assets/inttologo.png" alt="Intto Logo" width="50px" height="100px">
    </div>

    <div class="justify-center item-center align-items-center gap-4">
      <LiquidGlass>
        <RouterLink to="/dashboard" class="hover:bg-white/15 active:bg-white/30 text-white px-4 py-2 rounded-4xl" >Home</RouterLink>
        <RouterLink to="/active" class="hover:bg-white/15 active:bg-white/30 text-white px-4 py-2 rounded-4xl">Events</RouterLink>
        <RouterLink to="/settings" class="hover:bg-white/15 active:bg-white/30 text-white px-4 py-2 rounded-4xl">Settings</RouterLink>
        <RouterLink to="/eventcal" class="hover:bg-white/15 active:bg-white/30 text-white px-4 py-2 rounded-4xl">Add Event</RouterLink>
     </LiquidGlass>
     </div> 



  <div class="justify-items-center">
    <div class="round bg-black rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
    UC
    </div>
  </div>
  </section>
</template> -->
<template>
  <nav class="w-full h-25 flex justify-around bg-[#1C2D27]">
    <div class="justify-start" >
      <LiquidGlass
        :mouse-container="containerRef"
        :elasticity="0.15"
        :effect="liquidGlass"
        :mode="shader"
        :style="{ position: 'fixed', top: '5%', left: '5%', height: '50px', transform: 'translateX(-50%)' }" 
        class="bg-[#ffffff]/10  rounded-4xl">
      <img src="../assets/inttologo.png" alt="Intto Logo" width="50px" height="100px">
      </LiquidGlass>
    </div>
 
    <div class="justify-center item-center align-items-center"> 
      
        <LiquidGlass
          :mouse-container="containerRef"
          :elasticity="0.15"
          :effect="liquidGlass"
          :mode="shader"
          :style="{ position: 'fixed', top: '5%', left: '50%', height: '50px', transform: 'translateX(-50%)' }" 
          class="bg-[#ffffff]/10  rounded-4xl">

          <RouterLink to="/dashboard" class="hover:bg-white/15 active:bg-white/30 text-white text-lg font-poppins px-5 py-2 rounded-4xl" >Home</RouterLink>
          <RouterLink to="/active" class="hover:bg-white/15 active:bg-white/30 text-white text-lg font-poppins px-5 py-2 rounded-4xl">Events</RouterLink>
          <RouterLink to="/settings" class="hover:bg-white/15 active:bg-white/30 text-white text-lg font-poppins px-5 py-2 rounded-4xl">Settings</RouterLink>
          <RouterLink to="/eventcal" class="hover:bg-white/15 active:bg-white/30 text-white text-lg font-poppins px-5 py-2 rounded-4xl">Add Event</RouterLink>
        </LiquidGlass>
    </div>
    <div class="justify-end">
      <div class="round bg-gray-600/40 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
        UC
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>