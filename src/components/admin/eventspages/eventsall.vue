<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchAllEvents, getEventResponses } from "../../../service/docustore.js";

const router = useRouter();
const currentFilter = ref("All Events");
const searchQuery = ref("");
const eventsList = ref([]);
const isLoading = ref(true);
const isExporting = ref(false);

// fetch events sa firestore and compute stats
onMounted(async () => {
  try {
    const rawEvents = await fetchAllEvents();

    // fetch survey data
    const enhancedEvents = await Promise.all(
      rawEvents.map(async (event) => {
        try {
          const responses = await getEventResponses(event.id);
          
          const totalSurveys = responses ? responses.length : 0;
          const totalScans = parseInt(event.scans) || 0;
          const totalCerts = parseInt(event.certs) || 0;

          // cal event percentage
          let responseRate = "0%";
          if (totalScans > 0) {
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
          // if error
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

  // 'filter'
  return eventsWithDynamicStatus.filter((event) => {
    const matchesTab = currentFilter.value === "All Events" || event.status === currentFilter.value;
    
    const matchesSearch = !query || 
      (event.title && event.title.toLowerCase().includes(query)) ||
      (event.location && event.location.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });
});

// CSV Export Logic
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
    const dynamicHeaders = responses[0].answers ? Object.keys(responses[0].answers) : [];
    const allHeaders = [...standardHeaders, ...dynamicHeaders];

    let csvContent = allHeaders.join(",") + "\n";

    responses.forEach(res => {
      let dateStr = "N/A";
      if (res.timestamp) {
        const dateObj = res.timestamp.toDate ? res.timestamp.toDate() : new Date(res.timestamp);
        dateStr = !isNaN(dateObj) ? dateObj.toLocaleString() : "N/A";
      }

      const row = [
        `"${res.fullName || res.formData?.fullName || 'Unknown'}"`,
        `"${res.email || res.formData?.email || 'No email'}"`,
        `"${dateStr}"`
      ];

      dynamicHeaders.forEach(header => {
        const answer = res.answers && res.answers[header] ? res.answers[header] : "";
        row.push(`"${answer}"`); 
      });

      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    // format filename: Event_Name_Data.csv
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
  <main class="w-full font-poppins pt-8">
    <div class="w-full mx-auto px-6">
      <section
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div class="flex space-x-3">
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
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full bg-[#32423B] text-white text-sm pl-10 pr-10 py-2.5 rounded-full border border-[#445A50] focus:outline-none focus:border-[#6C8A7D] transition"
          />
          <div
            class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
            </svg>
          </div>
        </div>
      </section>

      <div
        class="hidden lg:block bg-[rgba(255,255,255,0.06)] rounded-4xl border border-[rgba(255,255,255,0.12)] px-8 py-5 mb-4 shadow-lg"
      >
        <div class="grid grid-cols-12 gap-4 items-center">
          <div class="col-span-5 text-white text-lg font-medium">
            Event Name
          </div>
          <div class="col-span-4 text-white text-lg font-medium">Summary</div>
          <div class="col-span-3 text-white text-lg font-medium text-right">
            Actions
          </div>
        </div>
      </div>

      <!-- EVENT ROWS (Transforms from Cards on Mobile -> Rows on Desktop) -->
      <div
        class="bg-[rgba(255,255,255,0.06)] rounded-4xl border border-[rgba(255,255,255,0.12)] p-4 shadow-lg flex flex-col gap-2"
      >
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-4 items-start lg:items-center px-4 py-5 lg:py-4 rounded-2xl hover:bg-[rgba(255,255,255,0.03)] transition duration-200 border border-white/5 lg:border-transparent"
        >
          <!-- 1. Event Name -->
          <div class="w-full lg:col-span-5 flex items-center gap-4">
            <div
              class="w-10 h-10 shrink-0 rounded-xl bg-[#32423B] border border-gray-600 flex items-center justify-center"
            >
              <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-white text-[15px] font-medium leading-tight">
                {{ event.title }}
              </h3>
              <p class="text-gray-400 text-[11px] mt-1">
                {{ event.date }} • {{ event.location }}
              </p>
            </div>
          </div>

          <!-- 2. Summary Statistics -->
          <div class="w-full lg:col-span-4 flex items-center justify-around lg:justify-start gap-4 lg:gap-8 bg-white/5 lg:bg-transparent rounded-xl py-3 lg:py-0">
            <div class="flex flex-col items-center">
              <span class="text-white text-[22px] font-semibold leading-none tracking-wide">{{ event.scans || 0 }}</span>
              <span class="text-gray-400 text-[10px] mt-1">Scans</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-white text-[22px] font-semibold leading-none tracking-wide">{{ event.certs || 0 }}</span>
              <span class="text-gray-400 text-[10px] mt-1">Certs</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-white text-[22px] font-semibold leading-none tracking-wide">{{ event.survey || '0%' }}</span>
              <span class="text-gray-400 text-[10px] mt-1">Survey</span>
            </div>
          </div>

          <!-- 3. Actions -->
          <div class="w-full lg:col-span-3 flex items-center justify-between lg:justify-end gap-3 mt-1 lg:mt-0">
            <button 
              @click="router.push(`/event-active/${event.id}`)"
              class="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2 lg:py-1.5 rounded-full bg-[#52806B]/20 border border-[#52806B]/60 text-[#9FC2B0] text-[11px] font-medium hover:bg-[#52806B]/40 transition cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              View Details
            </button>
            <button
              @click="exportEventData(event)"
              :disabled="isExporting"
              class="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2 lg:py-1.5 rounded-full bg-[#5D87A8]/20 border border-[#5D87A8]/60 text-[#A2C7E2] text-[11px] font-medium hover:bg-[#5D87A8]/40 transition cursor-pointer disabled:opacity-50"
            >
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
