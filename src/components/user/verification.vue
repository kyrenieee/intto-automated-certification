<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getEventById, getEventResponses } from '../../service/docustore' 

const route = useRoute()

const isLoading = ref(true)
const eventDetails = ref({})
const surveyResponses = ref([])
const searchQuery = ref('')

onMounted(async () => {
  try {
    const eventId = route.params.id
    
    const [fetchedEvent, fetchedResponses] = await Promise.all([
      getEventById(eventId),
      getEventResponses(eventId)
    ])

    eventDetails.value = fetchedEvent || {}
    surveyResponses.value = fetchedResponses || []

  } catch (error) {
    console.error("Failed to load event for verification:", error);
  } finally {
    isLoading.value = false;
  }
})

const getParticipantName = (participant) => {
  if (participant.fullName) return participant.fullName;
  if (participant.formData?.fullName) return participant.formData.fullName;

  if (participant.answers) {
    const keys = Object.keys(participant.answers);
    const nameKey = keys.find(k => k.toLowerCase().includes('full name') || k.toLowerCase().includes('your name') || k.toLowerCase().includes('name'));
    if (nameKey && participant.answers[nameKey]) {
      return participant.answers[nameKey];
    }
  }

  return 'Unknown Participant';
}

const filteredParticipants = computed(() => {
  if (!searchQuery.value) return surveyResponses.value;
  
  const query = searchQuery.value.toLowerCase();
  return surveyResponses.value.filter(participant => {
    return getParticipantName(participant).toLowerCase().includes(query);
  });
});
</script>

<template>
  <main class="w-full max-w-4xl mx-auto font-poppins pt-8 pb-12 text-white px-6">
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
    </div>

    <div v-else>
      <!-- Event Header -->
      <div class="mb-8 border-b border-[rgba(255,255,255,0.1)] pb-8">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">{{ eventDetails.title }}</h1>
        <p class="text-sm text-gray-400 mt-2">{{ eventDetails.startDate }} • {{ eventDetails.location }}</p>
      </div>

      <!-- Search Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h3 class="text-lg font-medium text-white tracking-wide">Participant Verification</h3>
          <p class="text-xs text-gray-400 mt-1">Search to verify attendance</p>
        </div>   
        <div class="relative w-full sm:w-72">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by full name..." 
            class="w-full bg-[#2E4238] text-white text-sm pl-9 pr-4 py-2.5 rounded-full border border-[#445A50] focus:outline-none focus:border-[#6C8A7D] transition placeholder-gray-400"
          />
        </div>
      </div>

      <!-- Participant List -->
      <div class="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
        
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-white/10 text-xs font-semibold tracking-widest text-gray-400 uppercase bg-black/20">
          Name
        </div>
        
        <!-- Results -->
        <div class="divide-y divide-white/5 max-h-[60vh] overflow-y-auto">
          <div 
            v-for="participant in filteredParticipants" 
            :key="participant.id"
            class="px-6 py-4 flex items-center gap-3 hover:bg-white/5 transition"
          >
            <!-- Checkmark Icon -->
            <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            </div>
            
            <div>
              <p class="text-sm font-medium text-white">{{ getParticipantName(participant) }}</p>
              <p class="text-[10px] text-emerald-400 mt-0.5">Verified Attendee</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredParticipants.length === 0" class="text-center py-16 text-gray-500 text-sm">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          No participants found matching "{{ searchQuery }}".
        </div>
      </div>

    </div>
  </main>
</template>