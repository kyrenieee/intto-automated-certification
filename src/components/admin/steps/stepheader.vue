<template>
  <header
    class="w-full bg-[rgba(255,255,255,0.04)] backdrop-blur-md border border-[rgba(255,255,255,0.10)] shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-3xl p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
  >
    <div
      v-for="(stepLabel, index) in steps"
      :key="index"
      class="flex items-center gap-3 transition-opacity duration-300"
      :class="currentStep === index + 1 ? 'opacity-100' : 'opacity-40'"
    >
      <!-- Circle Indicator -->
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-200"
        :class="
          currentStep === index + 1
            ? 'bg-white text-[#1a2620] border-white shadow-sm'
            : 'bg-white/5 border-white/10 text-white'
        "
      >
        {{ index + 1 }}
      </div>

      <!-- Text Label -->
      <div class="flex flex-col text-left">
        <span class="text-[10px] uppercase tracking-widest text-white/50 leading-none">
          Step {{ index + 1 }}
        </span>
        <span class="text-xs font-semibold text-white mt-1">
          {{ stepLabel }}
        </span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'StepHeader',
  props: {
    currentStep: {
      type: Number,
      required: true,
    },
    steps: {
      type: Array,
      default: () => [
        'Add Event Details',
        'Add Certificate Template',
        'Preview',
        'Response Builder',
      ],
    },
  },
}
</script>