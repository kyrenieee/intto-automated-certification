 <!-- transfer eventcal-det here and
 transfer this  there: 
<template>
  <div>
    step header
    <StepHeader :current-step="currentStep" />

    
    <Step1Details  v-if="currentStep === 1" @next="currentStep++" />
    <Step2Template v-if="currentStep === 2" @next="currentStep++" />
    <Step3Preview  v-if="currentStep === 3" @next="currentStep++" />
    <Step4Response v-if="currentStep === 4" @submit="saveEvent" />
  </div>
</template> -->

<template>
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
      </main>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style scoped>

</style>
