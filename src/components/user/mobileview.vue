<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMobileStore } from "../../stores/userstore.js";
import { getEventById } from "../../service/docustore.js";
import { generateCertificate } from "../../utils/certificate-gen.js"; // adjust path to wherever certificate-gen.js actually lives in your project

const route = useRoute();
const store = useMobileStore();

// 0: Landing, 1: Form, 2: Survey, 3: Certificate preview/download
const currentStep = ref(0);
const isLoading = ref(true);
const isTokenValid = ref(false);
const eventDetails = ref(null);
const surveyAnswers = ref({});

const isGeneratingCert = ref(false);
const certificateUrl = ref(null);
const certError = ref("");

const nextStep = () => {
  // step 2 -> 3 is handled separately by proceedToCertificate, since it needs to submit the survey and generate the certificate first.
  if (currentStep.value < 2) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};

// was previously a fake setTimeout + alert() with no actual survey save or certificate generation.  
// now saves the answers fr fr, then render the participant's actual certificate from the event's template + variableMap.
const proceedToCertificate = async () => {
  isGeneratingCert.value = true;
  certError.value = "";

  try {
    store.formData.answers = surveyAnswers.value;
    store.formData.eventId = route.params.id;

    await store.submitSurvey();

    if (!eventDetails.value.templateUrl) {
      throw new Error("This event has no certificate template configured.");
    }

    const formattedDate = eventDetails.value.startDate
      ? new Date(eventDetails.value.startDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    certificateUrl.value = await generateCertificate(
      eventDetails.value.templateUrl,
      eventDetails.value.variableMap || {},
      {
        name: store.formData.fullName,
        event_name: eventDetails.value.title,
        date: formattedDate,
      }
    );

    currentStep.value = 3;
  } catch (error) {
    console.error("Failed to finalize certificate:", error);
    certError.value = "Something went wrong generating your certificate. Please try again.";
  } finally {
    isGeneratingCert.value = false;
  }
};

onMounted(async () => {
  const eventId = route.params.id;
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  // fetch actual event data
  if (eventId) {
    try {
      eventDetails.value = await getEventById(eventId);

      if (eventDetails.value && eventDetails.value.questions) {
        eventDetails.value.questions.forEach((q) => {
          surveyAnswers.value[q.text] = null;
        });
      }
    } catch (error) {
      console.error("Failed to load event for survey:", error);
    }
  }

  // token verification - previously the result was discarded, so an expired or forged token never actually blocked anything.
  if (eventDetails.value) {
    store.formData.eventId = eventId;
    isTokenValid.value = await store.validateScan(token);
  }

  isLoading.value = false;
});
</script>

<template>
  <main class="min-h-screen  text-white font-poppins flex flex-col mx-auto relative max-w-md shadow-2xl overflow-x-hidden">
    
    <!-- Loading Screen -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mb-4"></div>
      <p class="text-gray-400 text-sm">Loading survey...</p>
    </div>

    <!-- Error Screen if Event Not Found -->
    <div v-else-if="!eventDetails" class="flex flex-col items-center justify-center h-screen p-8 text-center">
      <h2 class="text-xl font-bold mb-2">Event Not Found</h2>
      <p class="text-sm text-gray-400">This QR code might be expired or invalid.</p>
    </div>

    <!-- Error Screen if the scanned token doesn't match the event's current
         rolling token (expired, stale screenshot, or forged link) -->
    <div v-else-if="!isTokenValid" class="flex flex-col items-center justify-center h-screen p-8 text-center">
      <h2 class="text-xl font-bold mb-2">This QR code has expired</h2>
      <p class="text-sm text-gray-400">The code refreshes every few seconds. Please scan the code currently on screen.</p>
    </div>

    <!-- Step 0: Landing -->
    <div v-else-if="currentStep === 0" class="flex flex-col h-full min-h-screen">
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center pt-16">
        <div class="w-28 h-12 bg-[#25362F] rounded-full border border-gray-600 flex items-center justify-center mb-6">
          <span class="font-bold text-xl tracking-widest text-white">INNO</span>
        </div>
        <!-- DYNAMIC TITLE -->
        <h1 class="text-xl font-semibold tracking-wide">
          {{ eventDetails.title }}
        </h1>
        <!-- DYNAMIC DATE & LOCATION -->
        <p class="text-gray-300 text-xs mt-2">{{ eventDetails.startDate }} • {{ eventDetails.location }}</p>
      </div>

      <div class="bg-white text-[#1A2621] rounded-t-4xl p-8 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h2 class="text-lg font-bold">Get your certificate</h2>
        </div>
        <p class="text-gray-500 text-xs mb-8 leading-relaxed">
          Thank you for attending! Fill out a short form and answer our quick
          survey to receive your certificate of participation.
        </p>

        <div class="flex flex-col gap-5 mb-10">
          <div class="flex items-center gap-4 text-sm font-medium text-gray-700">
            <span class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-xs">1</span>
            Fill in your details
          </div>
          <div class="flex items-center gap-4 text-sm font-medium text-gray-700">
            <span class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-xs">2</span>
            Complete the survey
          </div>
          <div class="flex items-center gap-4 text-sm font-medium text-gray-700">
            <span class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-xs">3</span>
            Download your certificate instantly
          </div>
        </div>

        <button @click="nextStep" class="w-full py-3.5 rounded-full bg-[#65796E] hover:bg-[#526359] text-white font-medium transition-colors text-sm">
          Get your certificate
        </button>
      </div>
    </div>

    <!-- Steps 1-3 Wrapper -->
    <div v-else-if="currentStep >= 1 && currentStep <= 3" class="flex flex-col flex-1 p-6 min-h-screen">
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

      <!-- Step 1: Basic Information -->
      <div v-if="currentStep === 1" class="flex flex-col gap-6 flex-1">
        <div>
          <label class="block text-xs text-gray-300 mb-2 pl-1">* Your Full Name</label>
          <input
            v-model="store.formData.fullName"
            type="text"
            placeholder="Enter your full name"
            class="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#729281] transition text-white placeholder-gray-500"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-300 mb-2 pl-1">* Email Address</label>
          <input
            v-model="store.formData.email"
            type="email"
            placeholder="example@gmail.com"
            class="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#729281] transition text-white placeholder-gray-500"
          />
        </div>
      </div>

      <!-- Step 2: DYNAMIC SURVEY RENDERING -->
      <div v-if="currentStep === 2" class="flex flex-col gap-6 flex-1">
        
        <div v-for="question in eventDetails.questions" :key="question.id">
          <label class="block text-xs text-gray-300 mb-2 pl-1">{{ question.text }}</label>
          
          <!-- TYPE: TEXT -->
          <input
            v-if="question.type === 'text'"
            v-model="surveyAnswers[question.text]"
            type="text"
            placeholder="Your answer..."
            class="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#729281] transition text-white placeholder-gray-500"
          />

          <!-- TYPE: CHOICE -->
          <select
            v-else-if="question.type === 'choice'"
            v-model="surveyAnswers[question.text]"
            class="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-full px-5 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
          >
            <option :value="null" disabled class="bg-[#1A2621]">Select an option</option>
            <option
              v-for="option in question.options"
              :key="option"
              :value="option"
              class="bg-[#1A2621]"
            >
              {{ option }}
            </option>
          </select>

          <!-- TYPE: RATING -->
          <div v-else-if="question.type === 'rating'" class="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-full px-5 py-3 flex justify-around items-center">
            <button
              v-for="star in 5"
              :key="star"
              @click="surveyAnswers[question.text] = star"
              class="focus:outline-none transition-transform hover:scale-110 p-1"
            >
              <svg class="w-6 h-6" :class="surveyAnswers[question.text] >= star ? 'text-[#F4C150] fill-[#F4C150]' : 'text-gray-500 fill-transparent'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </button>
          </div>
        </div>

      </div>

      <!-- Step 3: Certificate Preview & Download -->
      <div v-if="currentStep === 3" class="flex flex-col items-center gap-6 flex-1">
        <p class="text-[15px] font-medium mt-4">Your certificate is ready!</p>

        <p v-if="certError" class="text-sm text-red-300 text-center">{{ certError }}</p>

        <img
          v-if="certificateUrl"
          :src="certificateUrl"
          alt="Your certificate"
          class="w-full rounded-2xl border-4 border-[#3D5248] shadow-2xl"
        />
        <div v-else class="w-full aspect-4/3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-sm text-gray-400">
          Certificate unavailable
        </div>

        <a
          v-if="certificateUrl"
          :href="certificateUrl"
          :download="`${store.formData.fullName.trim() || 'certificate'}.png`"
          class="w-3/4 max-w-50 py-2.5 rounded-full border border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-medium transition-colors text-center"
        >
          Download
        </a>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-auto pt-8 flex flex-col items-center gap-6">
        <button v-if="currentStep === 1" @click="nextStep" class="w-3/4 max-w-50 py-2.5 rounded-full border border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-medium transition-colors">
          Next
        </button>

        <button
          v-if="currentStep === 2"
          @click="proceedToCertificate"
          :disabled="isGeneratingCert"
          class="w-3/4 max-w-50 py-2.5 rounded-full border border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {{ isGeneratingCert ? "Generating…" : "Next" }}
        </button>

        <p class="text-[10px] text-gray-500 border-b border-gray-600 pb-0.5 mt-4 text-center">
          UC - Innovation and Technology Transfer Office
        </p>
      </div>
    </div>
  </main>
</template>