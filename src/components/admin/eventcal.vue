<script setup>
import { ref, computed } from 'vue'

// --- State Management ---
const selectedYear = ref(2026)
const selectedMonthIndex = ref(6) // 6 = July (0-indexed)
const selectedDay = ref(20)

// --- Dropdown States ---
const showYearDropdown = ref(false)
const showMonthDropdown = ref(false)

// --- Constants ---
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// --- Mock Event Data (Matches original indicator types) ---
const mockEvents = ref({
  '2026-07-02': 'finished',
  '2026-07-07': 'whole',
  '2026-07-10': 'whole',
  '2026-07-14': 'half'
})

// --- Computed Calendar Grid Math ---
const currentMonthName = computed(() => monthNames[selectedMonthIndex.value])

const calendarDays = computed(() => {
  const year = selectedYear.value
  const month = selectedMonthIndex.value

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate()

  const daysArray = []

  // trailing previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysArray.push({
      dayNumber: totalDaysInPrevMonth - i,
      isCurrentMonth: false,
      dateString: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-${String(totalDaysInPrevMonth - i).padStart(2, '0')}`
    })
  }

  // active current month grid array
  for (let i = 1; i <= totalDaysInMonth; i++) {
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  // leading trailing next month padding
  const totalSlots = Math.ceil(daysArray.length / 7) * 7
  const nextMonthPadding = totalSlots - daysArray.length
  for (let i = 1; i <= nextMonthPadding; i++) {
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: false,
      dateString: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    })
  }

  return daysArray
})

const selectedDayName = computed(() => {
  const dateObj = new Date(selectedYear.value, selectedMonthIndex.value, selectedDay.value)
  return dateObj.toLocaleDateString('en-US', { weekday: 'long' })
})

const hasEventOnSelectedDay = computed(() => {
  const activeKey = `${selectedYear.value}-${String(selectedMonthIndex.value + 1).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`
  return mockEvents.value[activeKey] || null
})

// --- actions ---
const handleDayClick = (day) => {
  if (day.isCurrentMonth) {
    selectedDay.value = day.dayNumber
  }
}

const selectYear = (year) => {
  selectedYear.value = year
  showYearDropdown.value = false
}

const selectMonth = (index) => {
  selectedMonthIndex.value = index
  showMonthDropdown.value = false
  const maxDays = new Date(selectedYear.value, index + 1, 0).getDate()
  if (selectedDay.value > maxDays) selectedDay.value = maxDays
}
</script>

<template>
  <div class="w-full max-w-5xl p-5 bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] mx-auto grid grid-cols-1 rounded-4xl lg:grid-cols-3 gap-6 font-poppins text-white px-4 ">
    
    <!-- left panel: calendar dates -->
    <section class="lg:col-span-2 bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-3xl p-6 flex flex-col justify-between">
      <div>
        <!-- date selector toggles -->
        <div class="flex items-center space-x-4 mb-6 relative">
          <!-- year dropdown -->
          <div class="relative">
            <button 
              @click="showYearDropdown = !showYearDropdown; showMonthDropdown = false"
              class="flex items-center space-x-1.5 text-lg font-semibold text-[rgba(255,255,255,0.95)] hover:text-white transition"
            >
              <span>{{ selectedYear }}</span>
              <span class="text-xs text-[rgba(255,255,255,0.4)]">▼</span>
            </button>
            <div v-if="showYearDropdown" class="absolute left-0 mt-2 w-28 bg-[#16221d] border border-[rgba(255,255,255,0.15)] rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto backdrop-blur-lg">
              <button v-for="y in [2024, 2025, 2026, 2027, 2028]" :key="y" @click="selectYear(y)" class="w-full text-left px-4 py-2 text-sm text-[rgba(255,255,255,0.8)] hover:bg-white/10 transition">
                {{ y }}
              </button>
            </div>
          </div>

          <!-- month dropdown -->
          <div class="relative">
            <button 
              @click="showMonthDropdown = !showMonthDropdown; showYearDropdown = false"
              class="flex items-center space-x-1.5 text-lg font-semibold text-[rgba(255,255,255,0.95)] hover:text-white transition"
            >
              <span>{{ currentMonthName }}</span>
              <span class="text-xs text-[rgba(255,255,255,0.4)]">▼</span>
            </button>
            <div v-if="showMonthDropdown" class="absolute left-0 mt-2 w-36 bg-[#16221d] border border-[rgba(255,255,255,0.15)] rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto backdrop-blur-lg">
              <button v-for="(m, idx) in monthNames" :key="m" @click="selectMonth(idx)" class="w-full text-left px-4 py-2 text-sm text-[rgba(255,255,255,0.8)] hover:bg-white/10 transition">
                {{ m }}
              </button>
            </div>
          </div>
        </div>

        <!-- weekdays -->
        <div class="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-[rgba(255,255,255,0.45)] mb-4 border-b border-white/5 pb-2 tracking-wide">
          <div v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>

        <!-- numeric dates grid-->
        <div class="grid grid-cols-7 gap-y-5 text-center items-center justify-items-center">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            @click="handleDayClick(day)"
            class="relative w-10 h-12 flex flex-col items-center justify-start pt-1.5 rounded-xl cursor-pointer transition select-none group"
            :class="[
              !day.isCurrentMonth ? 'text-white/20 pointer-events-none' : 'text-[rgba(255,255,255,0.85)]',
              day.isCurrentMonth && day.dayNumber === selectedDay ? 'bg-white/15 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-white' : 'hover:bg-white/5'
            ]"
          >
            <span class="text-sm font-medium z-10">{{ String(day.dayNumber).padStart(2, '0') }}</span>

            <!-- status dots/legends -->
            <span 
              v-if="day.isCurrentMonth && mockEvents[day.dateString]"
              class="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
              :class="{
                'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]': mockEvents[day.dateString] === 'whole',
                'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]': mockEvents[day.dateString] === 'half',
                'bg-white/30': mockEvents[day.dateString] === 'finished'
              }"
            ></span>
          </div>
        </div>
      </div>
    </section>

    <!-- right panel -  day info -->
    <section class="bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-3xl p-6 flex flex-col justify-between text-center min-h-90">
      <div>
        <h3 class="text-[rgba(255,255,255,0.45)] text-medium font-medium tracking-widest uppercase mt-2 mb-4">
          {{ currentMonthName }}
        </h3>
        
        <h1 class="text-9xl font-4xl tracking-tight text-white my-3 select-none">
          {{ String(selectedDay).padStart(2, '0') }}
        </h1>

        <p class="text-[rgba(255,255,255,0.75)] text-md tracking-wide mb-4">
          {{ selectedDayName }}
        </p>

        <div class="py-4    text-xs tracking-wide">
          <p v-if="!hasEventOnSelectedDay" class="text-[rgba(255,255,255,0.3)]">
            No scheduled event.
          </p>
          <p v-else class="text-emerald-400 font-medium capitalize">
            Scheduled: <span class="text-white">{{ hasEventOnSelectedDay }} Day Event</span>
            <!-- + event details -->
             
          </p>
        </div>
      </div>
      
      <div class="mt-6">
        <RouterLink
          to="/eventcal-details"
         >
        <!-- sched new event button -->
        <button class="w-full h-11 text-md font-normal tracking-wide text-[rgba(255,255,255,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.08))] border border-[rgba(255,255,255,0.15)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.12))] active:bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.16))] transition-all duration-200 rounded-full mb-6 shadow-sm">
          Schedule New Event
        </button>
        </RouterLink>
        <!-- legends -->
        <div class="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10px] text-[rgba(255,255,255,0.4)]">
          <div class="flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]"></span>
            <span>Whole Day</span>
          </div>
          <div class="flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]"></span>
            <span>Half Day</span>
          </div>
          <div class="flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-white/30"></span>
            <span>Finished</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>