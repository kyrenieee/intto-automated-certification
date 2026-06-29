<template>
  <main class="min-h-screen bg-[#1C2D27] p-8 font-poppins">
    <div class="max-w-6xl mx-auto">
      
      <section class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        
        <div class="flex space-x-3">
          <RouterLink to="/eventsall" class="px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] bg-[#2A3F35] text-white shadow-sm">
            All Events
          </RouterLink>
          <RouterLink to="/eventsactive" class="px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] text-gray-300 hover:text-white hover:bg-[#2A3F35] transition">
            Active
          </RouterLink>
          <RouterLink to="/eventscompleted" class="px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] text-gray-300 hover:text-white hover:bg-[#2A3F35] transition">
            Completed
          </RouterLink>
          <RouterLink to="/eventsupcoming" class="px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] text-gray-300 hover:text-white hover:bg-[#2A3F35] transition">
            Upcoming
          </RouterLink>
        </div>

        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            class="w-full bg-[#32423B] text-white text-sm pl-10 pr-10 py-2.5 rounded-full border border-[#445A50] focus:outline-none focus:border-[#6C8A7D] transition"
          >
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </div>
        </div>
      </section>

      <div class="bg-[rgba(255,255,255,0.06)] rounded-4xl border border-[rgba(255,255,255,0.12)] px-8 py-5 mb-4 shadow-lg">
        <div class="grid grid-cols-12 gap-4 items-center">
          <div class="col-span-5 text-white text-lg font-medium">Event Name</div>
          <div class="col-span-4 text-white text-lg font-medium">Summary</div>
          <div class="col-span-3 text-white text-lg font-medium">Actions</div>
        </div>
      </div> 

      <div class="bg-[rgba(255,255,255,0.06)] rounded-4xl border border-[rgba(255,255,255,0.12)] p-4 shadow-lg flex flex-col gap-2">
        
        <div 
          v-for="event in eventsList" 
          :key="event.id"
          class="grid grid-cols-12 gap-4 items-center px-4 py-4 rounded-2xl hover:bg-[rgba(255,255,255,0.03)] transition duration-200"
        >
          <div class="col-span-5 flex items-center gap-4">
            <div class="w-10 h-10 shrink-0 rounded-xl bg-[#32423B] border border-gray-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-white text-[15px] font-medium leading-tight">{{ event.title }}</h3>
              <p class="text-gray-400 text-[11px] mt-1">{{ event.date }} • {{ event.location }}</p>
            </div>
          </div>

          <div class="col-span-4 flex items-center gap-8">
            <div class="flex flex-col items-center">
              <span class="text-white text-[22px] font-semibold leading-none tracking-wide">{{ event.scans }}</span>
              <span class="text-gray-400 text-[10px] mt-1">Scans</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-white text-[22px] font-semibold leading-none tracking-wide">{{ event.certs }}</span>
              <span class="text-gray-400 text-[10px] mt-1">Certs</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-white text-[22px] font-semibold leading-none tracking-wide">{{ event.survey }}</span>
              <span class="text-gray-400 text-[10px] mt-1">Survey</span>
            </div>
          </div>

          <div class="col-span-3 flex items-center gap-3">
            <button class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#52806B]/20 border border-[#52806B]/60 text-[#9FC2B0] text-[11px] font-medium hover:bg-[#52806B]/40 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              View Details
            </button>
            <button class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5D87A8]/20 border border-[#5D87A8]/60 text-[#A2C7E2] text-[11px] font-medium hover:bg-[#5D87A8]/40 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export Data
            </button>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

// placeholder kasi wala pa ako firebase
const eventsList = ref([
  { id: 1, title: 'Technopreneurship Demo Day 7', date: 'April 7, 2026', location: 'UC Theater', scans: '103', certs: '87', survey: '85%' },
])
</script>

<style scoped>
</style> 