<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { fetchAllEvents, getEventResponses } from "../../../service/docustore.js";

const router = useRouter();
const currentFilter = ref("All Events");
const searchQuery = ref("");
const eventsList = ref([]);
const isLoading = ref(true);
const isExporting = ref(false);

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = 6;

// fetch events from firestore and compute stats
onMounted(async () => {
  try {
    const rawEvents = await fetchAllEvents();

    // fetch survey data
    const enhancedEvents = await Promise.all(
      rawEvents.map(async (event) => {
        try {
          const responses = await getEventResponses(event.id);
          
          const totalSurveys = responses ? responses.length : 0;
          const totalCerts = totalSurveys; 
          const totalScans =  totalSurveys; 

          let responseRate = "0%";
          if (totalScans === 0 && totalSurveys > 0) {
            responseRate = "100%";
          } else if (totalScans > 0) {
            responseRate = Math.round((totalSurveys / totalScans) * 100) + "%";
          }

          return {
            ...event,
            realScans: totalScans,
            realCerts: totalCerts,
            realSurveyRate: responseRate
          };
        } catch (err) {
          console.error(`Error fetching stats for event ${event.id}:`, err);
          // fallback if error
          return { ...event, realScans: 0, realCerts: 0, realSurveyRate: "0%" };
        }
      })
    );

    eventsList.value = enhancedEvents;
  } catch (error) {
    console.error("Failed to load events:", error);
  } finally {
    isLoading.value = false;
  }
});

// date calculation for events
const filteredEvents = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  const query = searchQuery.value.toLowerCase().trim();

  const eventsWithDynamicStatus = eventsList.value.map((event) => {
    let calculatedStatus = "Upcoming";

    if (event.date < today) {
      calculatedStatus = "Completed";
    } else if (event.date === today) {
      calculatedStatus = "Active";
    }
    return { ...event, status: calculatedStatus };
  });

  // filter
  return eventsWithDynamicStatus.filter((event) => {
    const matchesTab = currentFilter.value === "All Events" || event.status === currentFilter.value;
    
    const matchesSearch = !query || 
      (event.title && event.title.toLowerCase().includes(query)) ||
      (event.location && event.location.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });
});

// --- pagination  ---

watch([currentFilter, searchQuery], () => {
  currentPage.value = 1;
});

// total pages needed
const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage);
});

// show 6 only
const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredEvents.value.slice(start, end);
});

// CSV Export Logic
const getExportName = (res) => {
  if (res.fullName) return res.fullName;
  if (res.formData?.fullName) return res.formData.fullName;
  if (res.answers) {
    const keys = Object.keys(res.answers);
    const nameKey = keys.find(k => k.toLowerCase().includes('full name') || k.toLowerCase().includes('your name') || k.toLowerCase().includes('name'));
    if (nameKey && res.answers[nameKey]) return res.answers[nameKey];
  }
  return 'Unknown';
};

const getExportEmail = (res) => {
  if (res.email) return res.email;
  if (res.formData?.email) return res.formData.email;
  if (res.answers) {
    const keys = Object.keys(res.answers);
    const emailKey = keys.find(k => k.toLowerCase().includes('email'));
    if (emailKey && res.answers[emailKey]) return res.answers[emailKey];
  }
  return 'No email';
};

const getExportTimestamp = (res) => {
  const rawTime = res.timestamp || res.createdAt || res.submittedAt || res.date;
  if (!rawTime) return 'N/A';
  const dateObj = rawTime.toDate ? rawTime.toDate() : new Date(rawTime);
  if (isNaN(dateObj)) return 'N/A';
  return dateObj.toLocaleString();
};

const exportEventData = async (event) => {
  if (isExporting.value) return;
  isExporting.value = true;

  try {
    const responses = await getEventResponses(event.id);
    
    if (!responses || responses.length === 0) {
      alert(`There are no survey responses for "${event.title}" yet.`);
      isExporting.value = false;
      return;
    }

    const standardHeaders = ["Name", "Email", "Timestamp"];
    
    // SMART HEADER DETECTION: Find the first response with answers, handling the double-nesting
    const firstRes = responses.find(r => r.answers);
    const sampleAnswers = firstRes ? (firstRes.answers.answers || firstRes.answers) : {};
    const dynamicHeaders = Object.keys(sampleAnswers);
    
    const allHeaders = [...standardHeaders, ...dynamicHeaders];

    let csvContent = allHeaders.join(",") + "\n";

    responses.forEach(res => {
      const name = getExportName(res);
      const email = getExportEmail(res);
      const dateStr = getExportTimestamp(res);

      const row = [
        `"${name}"`,
        `"${email}"`,
        `"${dateStr}"`
      ];

      // SMART ANSWER EXTRACTION: Look inside answers.answers if it exists
      const actualAnswers = res.answers?.answers || res.answers || {};

      dynamicHeaders.forEach(header => {
        let answer = actualAnswers[header];
        
        // Fallback for blank fields
        if (answer === undefined || answer === null) {
          answer = "";
        }

        // Clean up formatting to prevent CSV breaking
        row.push(`"${String(answer).replace(/"/g, '""')}"`); 
      });

      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.title.replace(/\s+/g, '_')}_Data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error("Failed to export data:", error);
    alert("An error occurred while exporting data. Please try again.");
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <main class="w-full font-poppins pt-8 pb-12">
    <div class="w-full mx-auto px-6">
      
      <!-- Top Bar: Filters & Search -->
      <section class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div class="flex flex-wrap gap-3">
          <button
            @click="currentFilter = 'All Events'"
            :class="[
              'px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] transition cursor-pointer',
              currentFilter === 'All Events'
                ? 'bg-[#2A3F35] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#2A3F35]',
            ]"
          >
            All Events
          </button>
          <button
            @click="currentFilter = 'Active'"
            :class="[
              'px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] transition cursor-pointer',
              currentFilter === 'Active'
                ? 'bg-[#2A3F35] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#2A3F35]',
            ]"
          >
            Active
          </button>
          <button
            @click="currentFilter = 'Completed'"
            :class="[
              'px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] transition cursor-pointer',
              currentFilter === 'Completed'
                ? 'bg-[#2A3F35] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#2A3F35]',
            ]"
          >
            Completed
          </button>
          <button
            @click="currentFilter = 'Upcoming'"
            :class="[
              'px-6 py-2 rounded-full text-sm font-medium border border-[#3E5249] transition cursor-pointer',
              currentFilter === 'Upcoming'
                ? 'bg-[#2A3F35] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-[#2A3F35]',
            ]"
          >
            Upcoming
          </button>
        </div>

        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full bg-[#32423B] text-white text-sm pl-10 pr-10 py-2.5 rounded-full border border-[#445A50] focus:outline-none focus:border-[#6C8A7D] transition"
          />
        </div>
      </section>

      <!-- Empty State -->
      <div v-if="filteredEvents.length === 0 && !isLoading" class="text-center py-20 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-3xl">
        <p class="text-gray-400 text-lg">No events found matching your criteria.</p>
      </div>

      <!-- EVENT CARDS GRID -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <div
          v-for="event in paginatedEvents" 
          :key="event.id"
          class="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-4xl p-6 shadow-lg hover:bg-[rgba(255,255,255,0.09)] transition-all duration-300 flex flex-col"
        >
          <!-- event name -->
          <div class="flex items-start gap-4 mb-6">
            <div class="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mt-0.5">
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-white text-[17px] font-semibold leading-snug truncate">
                {{ event.title }}
              </h3>
              <p class="text-gray-400 text-xs mt-1.5 truncate">
                {{ event.date }} • {{ event.location }}
              </p>
            </div>
          </div>

          <!-- event stats -->
          <div class="flex items-center justify-around bg-black/20 rounded-2xl py-4 mb-6 border border-white/5">
            <div class="flex flex-col items-center">
              <span class="text-white text-[24px] font-semibold leading-none tracking-wide">{{ event.realScans || 0 }}</span>
              <span class="text-gray-400 text-[10px] uppercase tracking-wider mt-2">Scans</span>
            </div>
            <div class="w-px h-10 bg-white/10"></div>
            <div class="flex flex-col items-center">
              <span class="text-white text-[24px] font-semibold leading-none tracking-wide">{{ event.realCerts || 0 }}</span>
              <span class="text-gray-400 text-[10px] uppercase tracking-wider mt-2">Certs</span>
            </div>
            <div class="w-px h-10 bg-white/10"></div>
            <div class="flex flex-col items-center">
              <span class="text-white text-[24px] font-semibold leading-none tracking-wide">{{ event.realSurveyRate || '0%' }}</span>
              <span class="text-gray-400 text-[10px] uppercase tracking-wider mt-2">Survey</span>
            </div>
          </div>

          <!-- actions -->
          <div class="flex items-center gap-3 mt-auto">
            <button 
              @click="router.push(`/event-active/${event.id}`)"
              class="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-full bg-[#52806B]/20 border border-[#52806B]/60 text-[#9FC2B0] text-[12px] font-medium hover:bg-[#52806B]/40 transition cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              View Details
            </button>
            <button
              @click="exportEventData(event)"
              :disabled="isExporting"
              class="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-full bg-[#5D87A8]/20 border border-[#5D87A8]/60 text-[#A2C7E2] text-[12px] font-medium hover:bg-[#5D87A8]/40 transition cursor-pointer disabled:opacity-50"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Export Data
            </button>
          </div>
        </div>
      </div>

      <!-- pagination  -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
        <!-- prev -->
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.08)] transition disabled:opacity-30 disabled:cursor-not-allowed mr-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <!-- pages -->
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition cursor-pointer',
            currentPage === page
              ? 'bg-[#325243] text-white border border-[#446b58]'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          ]"
        >
          {{ page }}
        </button>

        <!-- next -->
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.08)] transition disabled:opacity-30 disabled:cursor-not-allowed ml-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

    </div>
  </main>
</template>
