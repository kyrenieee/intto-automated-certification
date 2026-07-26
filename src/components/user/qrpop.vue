<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { getEventById } from '../../service/docustore.js' 
import { useQrStore } from '../../service/qrstore.js'
import inttoLogo from '../../assets/inttologo.svg'
const route = useRoute()
const router = useRouter()
const qrStore = useQrStore()

const eventDetails = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const eventId = route.params.id
    const fetchedEvent = await getEventById(eventId)
    
    eventDetails.value = fetchedEvent

    if (eventDetails.value) {
      qrStore.startRollingQr(eventDetails.value.id);
    }
  } catch (error) {
    console.error("Failed to load event for presentation:", error);
  } finally {
    isLoading.value = false;
  }
})

onUnmounted(() => {
  qrStore.stopRollingQr()
})
</script>

<template>    
    <div v-if="isLoading" class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-400"></div>
    </div>

    <div v-else-if="!eventDetails" class="text-center py-20 text-gray-400">
      <h2 class="text-3xl font-bold text-white mb-2">Event Not Found</h2>
      <p>This event may have been deleted or the link is invalid.</p>
    </div>

    <!-- Presentation Container -->
    <div v-else class="w-full max-w-4xl mx-auto">
      
      <div class="bg-[rgba(255,255,255,0.06)] rounded-[3rem] border border-[rgba(255,255,255,0.12)] p-10 sm:p-16 shadow-2xl flex flex-col items-center">
        
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="text-4xl sm:text-6xl font-bold tracking-tight mb-4 text-emerald-50">{{ eventDetails.title }}</h1>
          <p class="text-xl text-emerald-200/60 uppercase tracking-widest font-medium">
            {{ eventDetails.startDate }} • {{ eventDetails.location }}
          </p>
        </div>

        <!-- Giant QR Code Display -->
        <div class="bg-[#E8F5EE] rounded-[2.5rem] p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-lg relative w-full max-w-xl">
          <h3 class="text-[#1A2621] text-2xl sm:text-3xl font-bold mb-3">Scan to Claim Certificate</h3>
          <p class="text-[#65796E] text-base mb-10 max-w-sm">
            Point your mobile camera at the code below to complete the survey and download your certificate.
          </p>
          
          <div class="relative bg-white p-6 rounded-4xl shadow-md border border-gray-100 transition-opacity duration-300">
            <qrcode-vue :value="qrStore.rollingUrl" :size="320" level="M" foreground="#1A2621" /> 
            
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-xl">
              <div class="w-14 h-14 rounded-full bg-[#1A2621] flex items-center justify-center">
                <img :src="inttoLogo" alt="InTTO Logo" class="w-8 h-auto object-contain">
              </div>
            </div>
          </div>
          
          <p class="absolute bottom-6 text-sm font-medium text-[#65796E] animate-pulse flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Code refreshes automatically...
          </p>
        </div>

      </div>
    </div>
</template>