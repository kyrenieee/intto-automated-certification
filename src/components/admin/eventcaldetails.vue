<script setup>
import { ref } from "vue";
// import { analytics } from "@/firebase/config";
// import { logEvent } from "firebase/analytics";

// --- form state ---
const currentStep = ref(1);
const eventForm = ref({
  name: "",
  endDate: "",
  endTime: "",
  location: "",
});



const selectLocation = (selectedPlace) => {
  eventForm.value.location = selectedPlace;
  showLocationPicker.value = false;

  // optional analytics tracking safeties
  if (typeof analytics !== 'undefined' && analytics) {
    logEvent(analytics, "location_selected", { place_name: selectedPlace });
  }
};

const handleNextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
};
</script>

<template>
  <div
    class="w-full max-w-5xl mx-auto px-4 sm:px-6 font-poppins text-white flex flex-col gap-y-6"
  >
    <!-- 1. steps header -->
    <header
      class="w-full bg-[rgba(255,255,255,0.04)] backdrop-blur-md border border-[rgba(255,255,255,0.10)] shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-3xl p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div
        class="flex items-center gap-3"
        :class="currentStep === 1 ? 'opacity-100' : 'opacity-40'"
      >
        <div
          class="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-xs font-bold shadow-sm"
        >
          1
        </div>
        <div class="flex flex-col text-left">
          <span
            class="text-[10px] uppercase tracking-widest text-white/50 leading-none"
            >Step 1</span
          >
          <span class="text-xs font-semibold text-white mt-1"
            >Add Event Details</span
          >
        </div>
      </div>
      <div
        class="flex items-center gap-3"
        :class="currentStep === 2 ? 'opacity-100' : 'opacity-40'"
      >
        <div
          class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold"
        >
          2
        </div>
        <div class="flex flex-col text-left">
          <span
            class="text-[10px] uppercase tracking-widest text-white/50 leading-none"
            >Step 2</span
          >
          <span class="text-xs font-semibold text-white mt-1"
            >Add Certificate Template</span
          >
        </div>
      </div>
      <div
        class="flex items-center gap-3"
        :class="currentStep === 3 ? 'opacity-100' : 'opacity-40'"
      >
        <div
          class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold"
        >
          3
        </div>
        <div class="flex flex-col text-left">
          <span
            class="text-[10px] uppercase tracking-widest text-white/50 leading-none"
            >Step 3</span
          >
          <span class="text-xs font-semibold text-white mt-1">Preview</span>
        </div>
      </div>
      <div
        class="flex items-center gap-3"
        :class="currentStep === 4 ? 'opacity-100' : 'opacity-40'"
      >
        <div
          class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold"
        >
          4
        </div>
        <div class="flex flex-col text-left">
          <span
            class="text-[10px] uppercase tracking-widest text-white/50 leading-none"
            >Step 4</span
          >
          <span class="text-xs font-semibold text-white mt-1"
            >Response Builder</span
          >
        </div>
      </div>
    </header>

    <!-- 2. form builder -->
    <main
      class="w-full bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-3xl p-6 sm:p-10 flex flex-col gap-y-8"
    >
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div class="text-left">
          <h1 class="text-4xl font-bold tracking-tight text-white">
            Event Details
          </h1>
          <p class="text-sm text-[rgba(255,255,255,0.55)] mt-1.5 font-light">
            Add the basic details of your event.
          </p>
        </div>

        <button
          @click="handleNextStep"
          class="flex items-center gap-2 px-6 h-11 bg-transparent hover:bg-white/5 active:bg-white/10 border border-white/10 rounded-full text-xs font-medium tracking-wide text-white transition-all duration-200"
        >
          <span>Continue to Next Step</span>
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
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </button>
      </div>

      <form
        v-if="currentStep === 1"
        class="w-full flex flex-col gap-y-6 text-left"
        @submit.prevent
      >
        <label class="flex flex-col gap-y-2">
          <span
            class="text-sm font-semibold tracking-wide text-[rgba(255,255,255,0.95)]"
            >Event Name*</span
          >
          <input
            v-model="eventForm.name"
            type="text"
            placeholder="e.g., Technodemo Day 7"
            class="w-full h-12 px-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.35)] focus:border-[rgba(255,255,255,0.7)] text-sm rounded-full outline-none transition-all duration-200 placeholder:text-white/20 text-white"
          />
        </label>

        <label class="flex flex-col gap-y-2">
          <span
            class="text-sm font-semibold tracking-wide text-[rgba(255,255,255,0.95)]"
            >Event End Date*</span
          >
          <input
            v-model="eventForm.endDate"
            type="date"
            class="w-full h-12 px-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.35)] focus:border-[rgba(255,255,255,0.7)] text-sm rounded-full outline-none transition-all duration-200 text-white color-scheme-dark"
          />
        </label>

        <label class="flex flex-col gap-y-2">
          <span
            class="text-sm font-semibold tracking-wide text-[rgba(255,255,255,0.95)]"
            >Event End Time*</span
          >
          <input
            v-model="eventForm.endTime"
            type="time"
            class="w-full h-12 px-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.35)] focus:border-[rgba(255,255,255,0.7)] text-sm rounded-full outline-none transition-all duration-200 text-white color-scheme-dark"
          />
        </label>

        <!-- live search loc -->
        <div class="flex flex-col gap-y-2 relative">
          <span
            class="text-sm font-semibold tracking-wide text-[rgba(255,255,255,0.95)]"
            >Event Location*</span
          >
          <div class="relative">
            <input
              :value="eventForm.location"
              @input="handleLocationInput"
              @focus="showLocationPicker = true"
              @blur="setTimeout(() => (showLocationPicker = false), 250)"
              type="text"
              placeholder="Start typing an address or place name..."
              class="w-full h-12 px-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.35)] focus:border-[rgba(255,255,255,0.7)] text-sm rounded-full outline-none transition-all duration-200 placeholder:text-white/20 text-white pr-12"
            />
            <!-- Spinner / Down Arrow indicator -->
            <span
              class="absolute right-5 top-3.5 text-xs text-white/30 pointer-events-none"
            >
              <span
                v-if="isSearching"
                class="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              ></span>
              <span v-else>▼</span>
            </span>
          </div>

          <!-- overlay menu emeng glass -->
          <div
            v-if="showLocationPicker && locationResults.length > 0"
            class="absolute left-0 top-18 w-full bg-[rgba(22,34,29,0.96)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] shadow-2xl rounded-2xl overflow-hidden z-30 max-h-60 overflow-y-auto"
          >
            <button
              v-for="place in locationResults"
              :key="place"
              @mousedown="selectLocation(place)"
              type="button"
              class="w-full text-left px-6 py-3 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-none truncate"
            >
              {{ place }}
            </button>
          </div>

        </div>
      </form>
          <!-- add template -->
      <form v-if="currentStep === 2" class="w-full flex flex-col gap-y-6 text-left" @submit.prevent>
        <label class="flex flex-col gap-y-2">
          <span class="text-sm font-semibold tracking-wide text-[rgba(255,255,255,0.95)]">Certificate Template*</span>
          <input type="file" accept=".png,.jpg,.jpeg,.pdf" class="w-full h-12 px-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.35)] focus:border-[rgba(255,255,255,0.7)] text-sm rounded-full outline-none transition-all duration-200 placeholder:text-white/20 text-white" />
        </label>
        
      </form>

      
    </main>
      
    </div>
 
</template>

<style scoped>
.color-scheme-dark {
  color-scheme: dark;
}
</style>
