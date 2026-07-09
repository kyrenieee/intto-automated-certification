<template>
  <main class="w-full bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-4xl p-8 sm:p-12 text-white font-['Poppins']">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

      <!-- left panel - config -->
      <div class="lg:col-span-5 flex flex-col justify-between min-h-105 gap-y-10">
        <div>
          <h1 class="text-3xl sm:text-[44px] font-bold leading-tight tracking-tight mb-2">
            Certificate Preview
          </h1>
          <p class="text-base sm:text-lg font-normal text-gray-300/90 leading-relaxed mb-8">
            Define which fields get mapped onto your template.
          </p>

          <!-- variable cards -->
          <div class="flex flex-col gap-y-3">
            <div
              v-for="variable in variables"
              :key="variable.key"
              class="group flex items-center bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-4xl p-5 hover:bg-white/10 hover:border-white/30 transition-all cursor-grab"
            >
              <div class="grid grid-cols-2 gap-1 text-gray-400 group-hover:text-white mr-5">
                <div class="w-1.5 h-1.5 bg-current rounded-full" v-for="n in 6" :key="n"></div>
              </div>
              <div>
                <span class="text-lg sm:text-xl font-medium text-white">{{ variable.label }}</span>
                <span class="text-sm text-gray-400 block">
                  {{ variable.key }} • {{ variable.required ? 'Required' : 'Optional' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="$emit('back')"
            class="border border-white/20 rounded-full px-6 py-3 text-sm hover:bg-white/10 transition-colors"
          >
            Back
          </button>
          <button
            @click="$emit('next')"
            class="border border-white/20 rounded-full px-8 py-4 text-base sm:text-[19px] hover:bg-white/10 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>

      <!-- right panel - canvas -->
      <div class="lg:col-span-7 lg:pl-6">
        <div class="w-full aspect-16/10 bg-white rounded-2xl shadow-2xl relative overflow-hidden text-black p-8">
          <img
            v-if="templatePreviewUrl"
            :src="templatePreviewUrl"
            alt="Certificate template"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute top-0 right-0 w-36 h-36 bg-[#008080]/20 rounded-bl-full"></div>
          <div class="relative text-center my-auto flex flex-col items-center justify-center h-full">
            <h2 class="text-2xl sm:text-3xl font-extrabold uppercase text-[#0c4a43]">Certificate</h2>
            <div class="border-b-2 border-dashed border-[#008080] p-2 mt-10">
              <span class="text-xl sm:text-2xl font-semibold">
                {{ eventForm.name ? eventForm.name : 'Participant Name' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Step3Preview',
  props: {
    eventForm: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['next', 'back'],
  setup(props) {
    const variables = [
      { key: 'name', label: 'Participant Name', required: true },
      { key: 'event_name', label: 'Event Name', required: false },
      { key: 'date', label: 'Completion Date', required: false },
    ]

    const templatePreviewUrl = computed(() => {
      const file = props.eventForm?.templateFile
      if (file && file.type?.startsWith('image/')) {
        return URL.createObjectURL(file)
      }
      return null
    })

    return { variables, templatePreviewUrl }
  },
}
</script>

<style scoped>
</style>