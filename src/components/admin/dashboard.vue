<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
// Adjust this path to point to your actual docustore file!
import { fetchAllEvents } from "../../service/docustore.js";

const eventsList = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    eventsList.value = await fetchAllEvents();
  } catch (error) {
    console.error("Failed to load events for dashboard:", error);
  } finally {
    isLoading.value = false;
  }
});

// 1. TOTAL EVENTS
const totalEventsCount = computed(() => eventsList.value.length);

const eventsThisWeek = computed(() => {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return eventsList.value.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= oneWeekAgo && eventDate <= today;
  }).length;
});

// 2. UPCOMING EVENTS
const upcomingEventsList = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  return eventsList.value
    .filter(event => event.date > today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const upcomingCount = computed(() => upcomingEventsList.value.length);

const nextEventLabel = computed(() => {
  if (upcomingEventsList.value.length === 0) return "No upcoming events";
  return `Next: ${upcomingEventsList.value[0].date}`;
});

// 3. ISSUED CERTIFICATES
const totalIssuedCerts = computed(() => {
  return eventsList.value.reduce((sum, event) => sum + (parseInt(event.certs) || 0), 0);
});

// 4. RESPONSE RATE
const averageResponseRate = computed(() => {
  if (eventsList.value.length === 0) return "0%";
  
  let totalSurveys = 0;
  let totalScans = 0;

  eventsList.value.forEach(event => {
    totalSurveys += parseInt(event.survey) || 0;
    totalScans += parseInt(event.scans) || 0;
  });

  if (totalScans === 0) return "0%";
  
  return ((totalSurveys / totalScans) * 100).toFixed(1) + "%";
});

// prevent errors if not definde
const trackDashboardClick = (action) => {
  console.log("Tracked:", action);
};
</script>

<template>
  <section class="w-full max-w-400 mx-auto px-4 sm:px-6 font-poppins text-white flex flex-col gap-y-6">
    <div class="flex justify-end items-center w-full">
      <!-- sched new event button wrapper -->
      <RouterLink
        to="/eventcal"
        @click="trackDashboardClick('schedule_new_event')"
        class="flex items-center gap-2 px-5 h-10 bg-[rgba(255,255,255,0.06)] hover:bg-white/10 active:bg-white/15 border border-[rgba(255,255,255,0.12)] shadow-[0_4px_30px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md rounded-full text-sm font-normal tracking-wide text-white transition-all duration-200"
      >
        <span>Schedule New Event</span>
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
        </svg>
      </RouterLink>
    </div>

    <!-- metric cards -->
    <div v-if="isLoading" class="flex justify-center items-center py-20 w-full">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
      <!-- card 1: total events -->
      <div class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-75">
        <div>
          <h3 class="text-md font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase">
            Total Events
          </h3>
          <p class="text-7xl font-medium text-white mt-6 align-center select-none">
            {{ totalEventsCount }}
          </p>
        </div>
        <div v-if="eventsThisWeek > 0" class="self-start px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-normal rounded-full flex items-center gap-1 shadow-sm">
          <span>+{{ eventsThisWeek }} this week</span>
        </div>
        <div v-else class="self-start px-3 py-1 bg-white/5 border border-white/10 text-white/50 text-xs font-normal rounded-full flex items-center gap-1 shadow-sm">
          <span>No new events this week</span>
        </div>
      </div>

      <!-- card 2: upcoming events-->
      <div class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-75">
        <div>
          <h3 class="text-md font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase">
            Upcoming Events
          </h3>
          <p class="text-7xl font-medium text-white mt-6 select-none">{{ upcomingCount }}</p>
        </div>
        <div class="self-start px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-normal rounded-full">
          <span>{{ nextEventLabel }}</span>
        </div>
      </div>

      <!-- card 3: issued certificates-->
      <div class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-55">
        <div>
          <h3 class="text-md font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase">
            Issued Certs
          </h3>
          <!-- toLocaleString() adds the commas (e.g., 1,284 instead of 1284) -->
          <p class="text-7xl font-medium text-white mt-6 select-none">{{ totalIssuedCerts.toLocaleString() }}</p>
        </div>
        <div class="self-start px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-normal rounded-full">
          <span>Total across all time</span>
        </div>
      </div>

      <!-- card 4: response rate -->
      <div class="bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-4xl p-5 flex flex-col justify-between min-h-75">
        <div>
          <h3 class="text-md font-normal tracking-wider text-[rgba(255,255,255,0.45)] uppercase">
            Response Rate
          </h3>
          <p class="text-7xl font-medium text-white mt-6 select-none">{{ averageResponseRate }}</p>
        </div>
        <div class="self-start px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-normal rounded-full">
          <span>Surveys vs. Scans</span>
        </div>
      </div>
    </div>
  </section>
</template>