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
            Click a field to drop it onto the template, then drag it into place.
          </p>

          <!-- variable cards -->
          <div class="flex flex-col gap-y-3">
            <div
              v-for="variable in variables"
              :key="variable.key"
              class="rounded-4xl border transition-all"
              :class="
                isPlaced(variable.key)
                  ? 'bg-emerald-400/10 border-emerald-300/40'
                  : 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.12)] hover:bg-white/10 hover:border-white/30'
              "
            >
              <button
                type="button"
                @click="toggleVariable(variable)"
                class="w-full group flex items-center p-5 text-left cursor-pointer"
              >
                <div class="grid grid-cols-2 gap-1 text-gray-400 group-hover:text-white mr-5">
                  <div class="w-1.5 h-1.5 bg-current rounded-full" v-for="n in 6" :key="n"></div>
                </div>
                <div class="flex-1">
                  <span class="text-lg sm:text-xl font-medium text-white">{{ variable.label }}</span>
                  <span class="text-sm text-gray-400 block">
                    {{ variable.key }} • {{ variable.required ? 'Required' : 'Optional' }}
                  </span>
                </div>
                <span
                  class="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
                  :class="isPlaced(variable.key) ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-white/60'"
                >
                  {{ isPlaced(variable.key) ? '✓ Placed' : '+ Add' }}
                </span>
              </button>

              <!-- read-only preview of what will actually render, sourced from eventForm -->
              <div v-if="isPlaced(variable.key)" class="px-5 pb-5">
                <p class="text-xs text-gray-400 mb-1">
                  {{ variable.key === 'name' ? 'Filled per participant at generation time' : 'From Step 1' }}
                </p>
                <p class="text-sm font-medium text-white/90 bg-black/20 border border-white/10 rounded-full px-4 py-2">
                  {{ fieldValues[variable.key] }}
                </p>
                <p v-if="variable.key === 'event_name' && !eventForm.name" class="text-xs text-amber-300 mt-1.5">
                  No event name set yet - go back to Step 1.
                </p>
                <p v-if="variable.key === 'date' && !eventForm.endDate" class="text-xs text-amber-300 mt-1.5">
                  No date set yet - go back to Step 1.
                </p>
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

      <!-- right panel - konva canvas -->
      <div class="lg:col-span-7 lg:pl-6">
        <div class="w-full aspect-16/10 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <CertificateCanvas
            v-if="templatePreviewUrl"
            :template-url="templatePreviewUrl"
            :variable-map="eventForm.variableMap"
            :field-values="fieldValues"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-sm text-gray-500">
            No template uploaded yet - go back to Step 2.
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">
          Drag a placed field to reposition it. Positions are saved relative to the
          template so they stay accurate at any canvas size.
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import { computed } from 'vue'
import CertificateCanvas from './konva.vue'

export default {
  name: 'Step3Preview',
  components: { CertificateCanvas },
  props: {
    eventForm: {
      type: Object,
      required: true,
    },
  },
  emits: ['next', 'back'],
  setup(props) {
    const variables = [
      { key: 'name', label: 'Participant Name', required: true },
      { key: 'event_name', label: 'Event Name', required: false },
      { key: 'date', label: 'Completion Date', required: false },
    ]

    // eventForm is the same reactive object all the way up from eventcaldetails.vue,
    // so make sure variableMap exists before children start reading/writing it.
    if (!props.eventForm.variableMap) props.eventForm.variableMap = {}

    const templatePreviewUrl = computed(() => props.eventForm.templateUrl || null)

    const formattedDate = computed(() => {
      if (!props.eventForm.endDate) return null
      const d = new Date(props.eventForm.endDate)
      if (Number.isNaN(d.getTime())) return props.eventForm.endDate
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    })

   
    // 'name' has no real value yet - it's a merge token resolved per participant later.
    const fieldValues = computed(() => ({
      name: '{{ Participant Name }}',
      event_name: props.eventForm.name || 'Event name not set',
      date: formattedDate.value || 'Date not set',
    }))

    const isPlaced = (key) => Boolean(props.eventForm.variableMap[key])

    const toggleVariable = (variable) => {
      const map = props.eventForm.variableMap
      if (map[variable.key]) {
        delete map[variable.key]
        return
      }
      // stagger the default drop position so new fields don't stack on top of each other
      const placedCount = Object.keys(map).length
      map[variable.key] = {
        xRatio: 0.5,
        yRatio: 0.3 + placedCount * 0.15,
        fontSize: 28,
        fill: '#0c4a43',
      }
    }

    return {
      eventForm: props.eventForm,
      variables,
      templatePreviewUrl,
      fieldValues,
      isPlaced,
      toggleVariable,
    }
  },
}
</script>

<style scoped>
</style>