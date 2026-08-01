 <script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { getEventById, getEventResponses } from '../../../service/docustore.js' 
import { useQrStore } from '../../../service/qrstore.js'
import inttoLogo from '../../../assets/inttologo.svg'

const route = useRoute()
const router = useRouter()
const activeTab = ref('statistics')
const isLoading = ref(true)

const qrStore = useQrStore()
const eventDetails = ref(null)
const surveyResponses = ref([])
const searchQuery = ref('')

// stats
const calculateChoicePercentage = (questionText, optionText) => {
  if (!surveyResponses.value.length) return 0;
  
  const totalAnswers = surveyResponses.value.filter(res => {
    const actualAnswers = res.answers?.answers || res.answers || {};
    return actualAnswers[questionText] !== undefined && actualAnswers[questionText] !== null && String(actualAnswers[questionText]).trim() !== '';
  }).length;
  
  if (totalAnswers === 0) return 0;

  const specificAnswers = surveyResponses.value.filter(res => {
    const actualAnswers = res.answers?.answers || res.answers || {};
    return actualAnswers[questionText] === optionText;
  }).length;
  
  return Math.round((specificAnswers / totalAnswers) * 100);
}

const getTextAnswers = (questionText) => {
  return surveyResponses.value
    .map(res => {
      const actualAnswers = res.answers?.answers || res.answers || {};
      let answer = actualAnswers[questionText];
      
      if (questionText.toLowerCase().includes('name') && !answer) {
        answer = res.fullName || res.formData?.fullName;
      }
      
      return answer;
    })
    .filter(answer => answer !== undefined && answer !== null && String(answer).trim() !== '')
    .map(answer => String(answer)); // ensures they render cleanly as strings in the template
}

const calculateAverageRating = (questionText) => {
  if (!surveyResponses.value.length) return 0;

  let totalRating = 0;
  let count = 0;
  
  surveyResponses.value.forEach(res => {
    const actualAnswers = res.answers?.answers || res.answers || {};
    const rating = Number(actualAnswers[questionText]);
    
    if (!isNaN(rating) && rating > 0) {
      totalRating += rating;
      count++;
    }
  });
  
  if (count === 0) return 0;
  return (totalRating / count).toFixed(1);
}

const getStarFillPercentage = (averageStr, starIndex) => {
  const average = parseFloat(averageStr) || 0;
  
  if (average >= starIndex) return 100;
  if (average <= starIndex - 1) return 0;
  
  return Math.round((average - (starIndex - 1)) * 100);
}

const totalResponses = computed(() => surveyResponses.value.length)
const totalCertificates = computed(() => surveyResponses.value.length)

const totalScans = computed(() => {
  const recordedScans = Number(eventDetails.value?.scans) || 0;
  const actualResponses = Number(totalResponses.value) || 0;
  
  return Math.max(recordedScans, actualResponses);
})

const responseRate = computed(() => {
  const scans = Number(totalScans.value);
  const responses = Number(totalResponses.value) || 0;
  
  if (scans === 0) {
    return responses > 0 ? '100%' : '0%';
  }
  return Math.round((responses / scans) * 100) + '%';
})

const getProgressColor = (index) => {
  const colors = ['bg-orange-500', 'bg-teal-400', 'bg-rose-500', 'bg-blue-400'];
  return colors[index % colors.length];
}

onMounted(async () => {
  try {
    const eventId = route.params.id
    
    const [fetchedEvent, fetchedResponses] = await Promise.all([
      getEventById(eventId),
      getEventResponses(eventId)
    ])
    
    eventDetails.value = fetchedEvent
    surveyResponses.value = fetchedResponses || []

    if (eventDetails.value) {
      qrStore.startRollingQr(eventDetails.value.id);
    }
  } catch (error) {
    console.error("Failed to load event :", error);
  } finally {
    isLoading.value = false;
  }
  qrStore.stopRollingQr()
})

// participants logic

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

const getParticipantEmail = (participant) => {
  if (participant.email) return participant.email;
  if (participant.formData?.email) return participant.formData.email;

  if (participant.answers) {
    const keys = Object.keys(participant.answers);
    const emailKey = keys.find(k => k.toLowerCase().includes('email'));
    if (emailKey && participant.answers[emailKey]) {
      return participant.answers[emailKey];
    }
  }

  return 'No email provided';
}

const getDepartment = (participant) => {
  if (participant.answers) {
    const keys = Object.keys(participant.answers);
    const deptKey = keys.find(k => k.toLowerCase().includes('department') || k.toLowerCase().includes('affiliated') || k.toLowerCase().includes('college'));
    if (deptKey && participant.answers[deptKey]) {
      return participant.answers[deptKey];
    }
  }
  
  return participant.department || participant.formData?.department || "UC"; 
}

const filteredParticipants = computed(() => {
  if (!searchQuery.value) return surveyResponses.value;
  
  const query = searchQuery.value.toLowerCase();
  return surveyResponses.value.filter(participant => {
    const nameMatch = getParticipantName(participant).toLowerCase().includes(query);
    const emailMatch = getParticipantEmail(participant).toLowerCase().includes(query);
    return nameMatch || emailMatch;
  });
});

const getParticipantTimestamp = (participant) => {
  const rawTime = participant.timestamp || participant.createdAt || participant.submittedAt || participant.date;
  
  if (!rawTime) return 'N/A';
  
  const dateObj = rawTime.toDate ? rawTime.toDate() : new Date(rawTime);
  
  if (isNaN(dateObj)) return 'N/A';

  return dateObj.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
</script>

<template>
  <main class="w-full font-poppins pt-8 pb-12 text-white">
    
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
    </div>

    <div v-else-if="!eventDetails" class="text-center py-20 text-gray-400">
      <h2 class="text-2xl font-bold text-white mb-2">Event Not Found</h2>
      <button @click="router.push('/events')" class="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition">Return to Events</button>
    </div>

      <div v-else class="w-full mx-auto px-6">      
      <div class="bg-[rgba(255,255,255,0.06)] rounded-4xl border border-[rgba(255,255,255,0.12)] p-6 sm:p-10 shadow-2xl">
        
        <div class="mb-8">
          <button @click="router.back()" class="flex items-center text-gray-400 hover:text-white transition mb-4 cursor-pointer">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </button>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">{{ eventDetails.title }}</h1>
          <p class="text-sm text-gray-400 mt-2">{{ eventDetails.startDate }} • {{ eventDetails.location }}</p>
        </div>

        <div class="flex flex-wrap gap-3 mb-10">
          <button 
            @click="activeTab = 'statistics'"
            :class="['px-5 py-2.5 rounded-full text-xs font-medium transition flex items-center gap-2 cursor-pointer', activeTab === 'statistics' ? 'bg-[#325243] text-white border border-[#446b58]' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10']"
          >
            Event Statistics
          </button>
          <button 
            @click="activeTab = 'survey'"
            :class="['px-5 py-2.5 rounded-full text-xs font-medium transition flex items-center gap-2 cursor-pointer', activeTab === 'survey' ? 'bg-[#325243] text-white border border-[#446b58]' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10']"
          >
            Survey Form
          </button>
          <button 
            @click="activeTab = 'participants'"
            :class="['px-5 py-2.5 rounded-full text-xs font-medium transition flex items-center gap-2 cursor-pointer', activeTab === 'participants' ? 'bg-[#325243] text-white border border-[#446b58]' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10']"
          >
            Participants
          </button>
        </div>

        <div v-if="activeTab === 'statistics'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div class="bg-[#5C7D6B] rounded-2xl p-6 shadow-inner relative">
              <p class="text-xs text-white/80 font-medium mb-3 tracking-wide">Certificates Issued</p>
              <h3 class="text-4xl font-semibold">{{ totalCertificates }}</h3>
            </div>
            
            <div class="bg-[#5C7D6B] rounded-2xl p-6 shadow-inner relative">
              <p class="text-xs text-white/80 font-medium mb-3 tracking-wide">QR Code Scans</p>
              <h3 class="text-4xl font-semibold">{{ totalScans }}</h3>
            </div>
            
            <div class="bg-[#5C7D6B] rounded-2xl p-6 shadow-inner relative">
              <p class="text-xs text-white/80 font-medium mb-3 tracking-wide">Survey Response Rate</p>
              <h3 class="text-3xl font-semibold">{{ responseRate }}</h3>
            </div>
            
            <div class="bg-[#5C7D6B] rounded-2xl p-6 shadow-inner relative">
              <p class="text-xs text-white/80 font-medium mb-3 tracking-wide">Total Responses</p>
              <h3 class="text-3xl font-semibold">{{ totalResponses }}</h3>
            </div>
          </div>

          <div v-if="eventDetails" class="lg:col-span-1 bg-[#E8F5EE] rounded-4xl p-8 flex flex-col items-center justify-center text-center shadow-lg relative min-h-87.5">            
            <h3 class="text-[#1A2621] text-lg font-bold">Event QR Code</h3>
            <p class="text-[#65796E] text-xs mt-1 mb-8 leading-relaxed max-w-50">
              Share this with participants to start the certificate flow
            </p>
            
            <div class="relative bg-white p-3 rounded-2xl shadow-sm border border-gray-100 transition-opacity duration-300">
                <qrcode-vue :value="qrStore.rollingUrl" :size="200" level="M" foreground="#1A2621" />              
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md">
                <div class="w-8 h-8 rounded-full bg-[#1A2621] flex items-center justify-center">
                  <img :src="inttoLogo" alt="InTTO Logo" class="w-5 h-auto object-contain">
                </div>
              </div>
            </div>

            <a 
              :href="`/present-qr/${eventDetails.id}`" 
              target="_blank"
              class="mt-8 z-10 w-full py-2.5 bg-[#1A2621] hover:bg-[#2c4038] text-white text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              Present to Screen
            </a>

          <p class="mt-4 text-[10px] font-medium text-[#65796E] animate-pulse">              
            Code refreshes automatically...
            </p>
          </div>
        </div>

        <div v-else-if="activeTab === 'survey'" class="flex flex-col gap-4">
          
          <div v-if="!eventDetails.questions || eventDetails.questions.length === 0" class="text-gray-400 text-center py-10">
            No survey questions were built for this event.
          </div>

          <div 
            v-else
            v-for="(question, index) in eventDetails.questions" 
            :key="question.id"
            class="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-[#1A382D] text-[#4ade80] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Question {{ index + 1 }}
              </span>
              <span class="text-xs text-gray-400">{{ surveyResponses.length }} Responses</span>
            </div>
            
            <h4 class="text-lg font-medium text-white mb-5">{{ question.text }}</h4>
            <div v-if="question.type === 'choice'" class="flex flex-col gap-4">
              <div v-for="(option, optIdx) in question.options" :key="optIdx" class="relative">
                <div class="flex justify-between text-xs text-gray-300 mb-1.5">
                  <span>{{ option }}</span>
                  <span>{{ calculateChoicePercentage(question.text, option) }}%</span>
                </div>
                <div class="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                  <div 
                    :class="[getProgressColor(optIdx), 'h-1.5 rounded-full transition-all duration-500']" 
                    :style="`width: ${calculateChoicePercentage(question.text, option)}%`">
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="question.type === 'text'" class="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <div v-if="getTextAnswers(question.text).length === 0" class="text-sm text-gray-500 italic">No answers yet.</div>
              <div 
                v-else
                v-for="(answer, ansIdx) in getTextAnswers(question.text)" 
                :key="ansIdx" 
                class="bg-black/20 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-gray-300"
              >
                {{ answer }}
              </div>
            </div>

            <!-- Real Rating Data -->
            <div v-else-if="question.type === 'rating'" class="flex items-center gap-1">
              <div class="flex gap-1">
                <div v-for="star in 5" :key="star" class="relative w-6 h-6">
                  
                  <!-- Background Star (Empty/Dimmed) -->
                  <svg class="absolute inset-0 w-6 h-6 text-white/10 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  
                  <!-- Foreground Star (Yellow, dynamically clipped) -->
                  <svg class="absolute inset-0 w-6 h-6 text-yellow-500 fill-current"
                       :style="{ clipPath: `inset(0 ${100 - getStarFillPercentage(calculateAverageRating(question.text), star)}% 0 0)` }"
                       viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  
                </div>
              </div>
              <span class="text-sm text-gray-400 ml-2">({{ calculateAverageRating(question.text) }} Average)</span>
            </div>

          </div>
        </div>

        <div v-else-if="activeTab === 'participants'" class="flex flex-col">
          
          <!-- Header & Search Bar -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h3 class="text-lg font-medium text-white tracking-wide">Participants</h3>
              <p class="text-xs text-gray-400 mt-1">
                {{ surveyResponses.length }} certificates downloaded
              </p>
            </div>
            
            <div class="relative w-full md:w-64">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search" 
                class="w-full bg-[#2E4238] text-white text-sm pl-9 pr-10 py-2 rounded-full border border-[#445A50] focus:outline-none focus:border-[#6C8A7D] transition placeholder-gray-400"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- participants -->

          <!-- Data Table -->
          <div class="w-full overflow-x-auto">
            <div class="min-w-175">
              
              <!-- Table Headers -->
              <div class="grid grid-cols-12 gap-4 pb-3 border-b border-white/10 text-[11px] font-semibold tracking-widest text-white uppercase mb-2">
                <div class="col-span-4 pl-2">Name</div>
                <div class="col-span-4">Email</div>
                <div class="col-span-2 text-center">Certificate</div>
                <div class="col-span-2 text-right pr-2">Scanned at</div>
              </div>

              <!-- Empty State -->
              <div v-if="filteredParticipants.length === 0" class="text-center py-12 text-gray-500 text-sm">
                No participants match your search criteria.
              </div>

              <!-- Participant Rows -->
              <div 
                v-else
                v-for="participant in filteredParticipants" 
                :key="participant.id"
                class="grid grid-cols-12 gap-4 items-center py-3.5 border-b border-white/5 hover:bg-white/5 transition px-2 rounded-xl group"
              >
                <!-- Name & Department -->
                <div class="col-span-4 flex flex-col">
                  <span class="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                    {{ getParticipantName(participant) }}
                  </span>
                  <span class="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wider">
                    {{ getDepartment(participant) }}
                  </span>
                </div>
                
                <!-- Email -->
                <div class="col-span-4 text-xs text-gray-300 truncate pr-4">
                  {{ getParticipantEmail(participant) }}
                </div>
                
                <!-- Certificate Status -->
                <div class="col-span-2 flex justify-center">
                  <div class="w-6 h-6 rounded bg-[#415C4F] border border-[#5A7A6A] flex items-center justify-center">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <!-- Timestamp -->
                <div class="col-span-2 text-right text-[11px] text-gray-400">
                  {{ getParticipantTimestamp(participant) }}
                </div>
              </div>

            </div>
          </div>
          
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>