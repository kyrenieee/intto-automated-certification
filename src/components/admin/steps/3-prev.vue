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
            Click a field to drop it onto the template, then drag it into place. Scroll over text to resize.
          </p>

          <!-- variable cards -->
          <div class="flex flex-col gap-y-3">
            <div
              v-for="variable in variables"
              :key="variable.key"
              class="rounded-4xl border transition-all"
              :class="
                isPlaced(variable.key)
                  ? 'bg-gray-400/5 border-gray-300/40'
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
                  :class="isPlaced(variable.key) ? 'bg-[#1C2D27] text-gray-300' : 'bg-white/10 text-white/60'"
                >
                  {{ isPlaced(variable.key) ? '✓ Placed' : '+ Add' }}
                </span>
              </button>

              <!-- customization controls for placed fields -->
              <div v-if="isPlaced(variable.key)" class="px-5 pb-5 flex flex-col gap-y-3">
                <p class="text-xs text-gray-400">
                  {{ variable.key === 'name' ? 'Filled per participant at generation time' : 'From Step 1' }}
                </p>
                <p class="text-sm font-medium text-white/90 bg-black/20 border border-white/10 rounded-full px-4 py-2">
                  {{ fieldValues[variable.key] }}
                </p>

                <!-- font & color customization controls -->
                <div class="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label class="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Color</label>
                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        v-for="color in colors"
                        :key="color"
                        @click="eventForm.variableMap[variable.key].fill = color"
                        class="w-5 h-5 rounded-full border transition-transform"
                        :class="eventForm.variableMap[variable.key].fill === color ? 'scale-110 border-white' : 'border-white/20'"
                        :style="{ backgroundColor: color }"
                      ></button>
                    </div>
                  </div>

                  <div>
                    <label class="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Font Family</label>
                    <select
                      v-model="eventForm.variableMap[variable.key].fontFamily"
                      class="w-full bg-black/30 text-white text-xs rounded-lg px-2 py-1.5 border border-white/10 outline-none focus:border-white/30"
                    >
                      <option v-for="font in fontOptions" :key="font" :value="font">{{ font }}</option>
                    </select>
                  </div>
                </div>

                <p v-if="variable.key === 'event_name' && !eventForm.name" class="text-xs text-amber-300 mt-1">
                  No event name set yet - go back to Step 1.
                </p>
                <p v-if="variable.key === 'date' && !eventForm.endDate" class="text-xs text-amber-300 mt-1">
                  No date set yet - go back to Step 1.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- right panel - konva canvas & navigation buttons -->
      <div class="lg:col-span-7 lg:pl-6 flex flex-col gap-6">
        <div class="w-full aspect-16/10 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <CertificateCanvas
            v-if="templatePreviewUrl"
            :template-url="templatePreviewUrl"
            :variable-map="eventForm.variableMap"
            :field-values="fieldValues"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center p-6 text-center text-sm text-gray-500 bg-gray-50">
            <p class="font-medium text-red-500 mb-1">Template image URL is missing or broken (404 Error).</p>
            <p class="text-xs text-gray-400">Please go back to Step 2 and re-upload your certificate template.</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          Drag fields to reposition. Scroll over any text item to change its font size.
        </p>

        <!-- navigation buttons placed at the very bottom right with a max width of 150px each -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <button
            @click="$emit('back')"
            class="w-full max-w-[150px] border border-white/20 rounded-full py-3 text-sm font-medium hover:bg-white/10 transition-colors text-center cursor-pointer"
          >
            Back
          </button>
          <button
            @click="$emit('next')"
            class="w-full max-w-[150px] border border-white/20 rounded-full py-3 text-sm font-medium hover:bg-white/10 transition-colors text-center cursor-pointer"
          >
            Continue
          </button>
        </div>
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

    const fontOptions = ['Poppins', 'Roboto', 'Playfair Display', 'Montserrat', 'Inter']
    const colors = ['#000000', '#0c4a43', '#1e3a8a', '#7f1d1d', '#78350f']

    if (!props.eventForm.variableMap) props.eventForm.variableMap = {}

    const templatePreviewUrl = computed(() => props.eventForm.templateUrl || null)

    const formattedDate = computed(() => {
      if (!props.eventForm.endDate) return null
      const d = new Date(props.eventForm.endDate)
      if (Number.isNaN(d.getTime())) return props.eventForm.endDate
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    })

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
      const placedCount = Object.keys(map).length
      map[variable.key] = {
        xRatio: 0.5,
        yRatio: 0.3 + placedCount * 0.15,
        fontSize: 28,
        fill: '#000000',
        fontFamily: 'Poppins',
      }
    }

    return {
      eventForm: props.eventForm,
      variables,
      fontOptions,
      colors,
      templatePreviewUrl,
      fieldValues,
      isPlaced,
      toggleVariable,
    }
  },
}
</script>
```[cite: 10]