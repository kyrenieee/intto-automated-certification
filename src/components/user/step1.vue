<script setup>
import { ref } from 'vue'
import StepLanding from './StepLanding.vue'
import StepDetails from './StepDetails.vue'
import StepSurvey from './StepSurvey.vue'
import StepCertificate from './StepCertificate.vue'

// form
const formData = ref({
  fullName: '',
  email: '',
  role: '',
  department: '',
  age: '',
  rating: 0
})

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}
</script>

<template>
  <main class="min-h-screen bg-[#1C2D27] text-white font-poppins flex flex-col mx-auto relative max-w-md shadow-2xl">
    
    <StepLanding v-if="currentStep === 0" @start="nextStep" />

    <div v-else class="flex flex-col flex-1 p-6 min-h-screen">
      
      <button @click="prevStep" class="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition w-fit mt-4">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back
      </button>

      <div class="mt-8 mb-8">
        <h2 class="text-xl font-semibold">Step {{ currentStep }} of 3</h2>
        <p class="text-sm text-gray-300 mt-1">
          <span v-if="currentStep === 1">Fill out the form</span>
          <span v-if="currentStep === 2">Quick Survey</span>
          <span v-if="currentStep === 3">Download your certificate</span>
        </p>
        <div class="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          Your information will only be used for the certificate generation.
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <StepDetails v-if="currentStep === 1" :formData="formData" />
        <StepSurvey v-if="currentStep === 2" :formData="formData" />
        <StepCertificate v-if="currentStep === 3" :formData="formData" />
      </div>

      <div class="mt-auto pt-8 flex flex-col items-center gap-6">
        <button 
          v-if="currentStep === 1 || currentStep === 2" 
          @click="nextStep" 
          class="w-3/4 max-w-50 py-3 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.15)] text-white text-sm font-medium transition-colors"
        >
          Next
        </button>

        <button 
          v-if="currentStep === 3" 
          class="w-3/4 max-w-50 py-3 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.15)] text-white text-sm font-medium transition-colors"
        >
          Download
        </button>

        <p class="text-[10px] text-gray-500 border-b border-gray-500 pb-0.5 mt-4">
          UC- Innovation and Technology Transfer Office
        </p>
      </div>

    </div>
  </main>
</template>