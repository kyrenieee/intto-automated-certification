<script setup>
import { RouterLink } from "vue-router";
// import { analytics } from "@/firebase/config";
// import { logEvent } from "firebase/analytics";

// const trackDashboardClick = (buttonName, extraMetadata = {}) => {
//   if (analytics) {
//     logEvent(analytics, 'dashboard_interaction', {
//       button_name: buttonName,
//       timestamp: new Date().toISOString(),
//       ...extraMetadata
//     });
//   }
// };
</script>

<template>
  <section
    class="w-full max-w-5xl mx-auto px-4 sm:px-6 font-poppins text-white flex flex-col gap-y-6"
  >
    <div class="flex justify-end items-center w-full">
      <!-- sched new event button wrapper -->
      <RouterLink
        to="/eventcal"
        @click="trackDashboardClick('schedule_new_event')"
        class="flex items-center gap-2 px-5 h-10 bg-[rgba(255,255,255,0.06)] hover:bg-white/10 active:bg-white/15 border border-[rgba(255,255,255,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md rounded-full text-sm font-normal tracking-wide text-white transition-all duration-200"
      >
        <span>Schedule New Event</span>
        <!-- plus svg -->
        <svg
          class="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      </RouterLink>
    </div>

    <!-- metric cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      <!-- card 1: total events -->
      <div
        class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-55"
      >
        <div>
          <h3
            class="text-xs font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase"
          >
            Total Events
          </h3>
          <p class=" text-6xl font-medium text-white mt-6 select-none">42</p>
        </div>
        <!-- status node -->
        <div
          class="self-start px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-normal rounded-full flex items-center gap-1 shadow-sm"
        >
          <span>+4 this week</span>
        </div>
      </div>

      <!-- card 2: upcoming events-->
      <div
        class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-44"
      >
        <div>
          <h3
            class="text-xs font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase"
          >
            Upcoming Events
          </h3>
          <p class="text-6xl font-medium text-white mt-6 select-none">12</p>
        </div>
        <div
          class="self-start px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-normal rounded-full"
        >
          <span>Next: Tomorrow</span>
        </div>
      </div>

      <!-- card 3: issued certificates-->
      <div
        class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-55"
      >
        <div>
          <h3
            class="text-xs font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase"
          >
            Issued Certs
          </h3>
          <p class="text-6xl font-medium text-white mt-6 select-none">1,284</p>
        </div>
        <div
          class="self-start px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-normal rounded-full"
        >
          <span>lorem</span>
        </div>
      </div>

      <!-- card 4: response rate -->
      <div
        class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-55"
      >
        <div>
          <h3
            class="text-xs font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase"
          >
            Response Rate
          </h3>
          <p class="text-6xl font-medium text-white mt-6 select-none">84.3%</p>
        </div>
        <div
          class="self-start px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-normal rounded-full"
        >
          <span>lorem ipsum</span>
        </div>
      </div>
    </div>
  </section>
</template>
