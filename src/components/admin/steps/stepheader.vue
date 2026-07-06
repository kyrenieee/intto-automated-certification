<template>
  <div class="w-full flex items-center justify-center gap-x-3">
    <template v-for="step in totalSteps" :key="step">
      <div class="flex items-center gap-x-2">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-200"
          :class="
            step === currentStep
              ? 'bg-white text-[#1a2620] border-white'
              : step < currentStep
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-transparent text-white/40 border-white/15'
          "
        >
          {{ step }}
        </div>
        <span
          v-if="step < totalSteps"
          class="w-10 h-px"
          :class="step < currentStep ? 'bg-white/40' : 'bg-white/10'"
        ></span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'StepHeader',
  props: {
    currentStep: {
      type: Number,
      required: true,
    },
    totalSteps: {
      type: Number,
      default: 4,
    },
  },
}
</script>

<style scoped>
</style>