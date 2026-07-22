 <script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { getEventById, getEventResponses } from '../../../service/docustore.js' 
import { useQrStore } from '../../../service/qrstore.js'

const route = useRoute()
const router = useRouter()
const activeTab = ref('statistics')
const isLoading = ref(true)

const qrStore = useQrStore()
const eventDetails = ref(null)
const surveyResponses = ref([])

// stats
const calculateChoicePercentage = (questionText, optionText) => {
  if (!surveyResponses.value.length) return 0
  
  const totalAnswers = surveyResponses.value.filter(res => res.answers[questionText]).length
  if (totalAnswers === 0) return 0

  const specificAnswers = surveyResponses.value.filter(res => res.answers[questionText] === optionText).length
  return Math.round((specificAnswers / totalAnswers) * 100)
}

const getTextAnswers = (questionText) => {
  return surveyResponses.value
    .map(res => res.answers[questionText])
    .filter(answer => answer !== undefined && answer !== null && String(answer).trim() !== '')
    .map(answer => String(answer)) // ensures they render cleanly as strings in the template
}

const calculateAverageRating = (questionText) => {
  const ratings = surveyResponses.value
    .map(res => res.answers[questionText])
    .filter(rating => typeof rating === 'number')
    
  if (!ratings.length) return 0
  const sum = ratings.reduce((a, b) => a + b, 0)
  return (sum / ratings.length).toFixed(1)
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
})

onUnmounted(() => {
  qrStore.stopRollingQr()
})

const getProgressColor = (index) => {
  const colors = ['bg-orange-500', 'bg-teal-400', 'bg-rose-500', 'bg-blue-400']
  return colors[index % colors.length]
}
</script>

<template>
  <main class="w-full font-poppins pt-8 pb-12 text-white">
    
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
    </div>

    <div v-else-if="!eventDetails" class="text-center py-20 text-gray-400">
      <h2 class="text-2xl font-bold text-white mb-2">Event Not Found</h2>
      <p>The event you are looking for does not exist or has been deleted.</p>
      <button @click="router.push('/events')" class="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition">Return to Events</button>
    </div>

    <div v-else class="w-full max-w-5xl mx-auto px-6">
      
      <div class="bg-[rgba(255,255,255,0.06)] rounded-[2rem] border border-[rgba(255,255,255,0.12)] p-6 sm:p-10 shadow-2xl">
        
        <div class="mb-8">
          <button @click="router.back()" class="flex items-center text-gray-400 hover:text-white transition mb-4 cursor-pointer">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
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
              <h3 class="text-4xl font-semibold">{{ eventDetails.certs || 0 }}</h3>
            </div>
            
            <div class="bg-[#5C7D6B] rounded-2xl p-6 shadow-inner relative">
              <p class="text-xs text-white/80 font-medium mb-3 tracking-wide">QR Code Scans</p>
              <h3 class="text-4xl font-semibold">{{ eventDetails.scans || 0 }}</h3>
            </div>
            
            <div class="bg-[#5C7D6B] rounded-2xl p-6 shadow-inner relative">
              <p class="text-xs text-white/80 font-medium mb-3 tracking-wide">Survey Response Rate</p>
              <h3 class="text-3xl font-semibold">{{ eventDetails.survey || '0%' }}</h3>
            </div>
            
            <div class="bg-[#5C7D6B] rounded-2xl p-6 shadow-inner relative">
              <p class="text-xs text-white/80 font-medium mb-3 tracking-wide">Total Responses</p>
              <h3 class="text-3xl font-semibold">{{ surveyResponses.length }}</h3>
            </div>
          </div>

          <div v-if="eventDetails" class="lg:col-span-1 bg-[#E8F5EE] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-lg relative min-h-[350px]">            <h3 class="text-[#1A2621] text-lg font-bold">Event QR Code</h3>
            <p class="text-[#65796E] text-xs mt-1 mb-8 leading-relaxed max-w-[200px]">
              Share this with participants to start the certificate flow
            </p>
            
            <div class="relative bg-white p-3 rounded-2xl shadow-sm border border-gray-100 transition-opacity duration-300">
                <qrcode-vue :value="qrStore.rollingUrl" :size="200" level="M" foreground="#1A2621" />              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md">
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-[8px] font-bold text-gray-800">InTTO</span>
                </div>
              </div>
            </div>
            <p class="absolute bottom-5 text-[10px] font-medium text-[#65796E] animate-pulse">
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
            <div v-else-if="question.type === 'rating'" class="flex items-center gap-2">
              <svg v-for="star in 5" :key="star" class="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span class="text-sm text-gray-400 ml-2">({{ calculateAverageRating(question.text) }} Average)</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
/* Optional: Custom scrollbar for text answers to keep the UI clean */
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