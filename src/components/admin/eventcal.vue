<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchAllEvents } from "../../service/docustore";
import { getDurationType } from "../../utils/Eventscheduling.js";

// --- state management ---
const today = new Date();
const selectedYear = ref(today.getFullYear());
const selectedMonthIndex = ref(today.getMonth());
const selectedDay = ref(today.getDate());

// --- dropdown States ---
const showYearDropdown = ref(false);
const showMonthDropdown = ref(false);

// --- constants ---
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- fetched data event from firestore---
const eventsList = ref([]);
const isLoadingEvents = ref(true);
const eventsError = ref("");

onMounted(async () => {
  try {
    eventsList.value = await fetchAllEvents();
  } catch (err) {
    console.error("Failed to load events for calendar:", err);
    eventsError.value = "Could not load booked events.";
  } finally {
    isLoadingEvents.value = false;
  }
});

const todayString = computed(() => new Date().toISOString().split("T")[0]);

const statusForEvent = (event) => {
  const start = event.startDate || event.date;
  if (start < todayString.value) return "finished";
  return event.durationType || getDurationType(event.endTime || event.time);
};

// Robust date range checker using timestamps to avoid string comparison flaws
const isDateInRange = (targetDateStr, startDateStr, endDateStr) => {
  if (!startDateStr) return false;
  const startStr = startDateStr.split("T")[0];
  const endStr = (endDateStr || startDateStr).split("T")[0];
  const targetStr = targetDateStr.split("T")[0];

  const targetTime = new Date(targetStr + "T00:00:00").getTime();
  const startTime = new Date(startStr + "T00:00:00").getTime();
  const endTime = new Date(endStr + "T00:00:00").getTime();

  return targetTime >= startTime && targetTime <= endTime;
};

// Range-aware status check for calendar grid cells
const statusForDate = (dateString) => {
  const targetTime = new Date(dateString + "T00:00:00").getTime();
  const todayTime = new Date(todayString.value + "T00:00:00").getTime();

  if (targetTime < todayTime) {
    const pastMatch = eventsList.value.some((e) => {
      const start = e.startDate || e.date;
      const end = e.endDate || start;
      return isDateInRange(dateString, start, end);
    });
    if (pastMatch) return "finished";
  }

  // Find all events active on this specific grid date string (supporting multi-day ranges)
  const activeEvents = eventsList.value.filter((e) => {
    const start = e.startDate || e.date;
    const end = e.endDate || start;
    return isDateInRange(dateString, start, end);
  });

  if (!activeEvents || activeEvents.length === 0) return null;

  const hasWhole = activeEvents.some(
    (e) => (e.durationType || getDurationType(e.endTime || e.time)) === "whole"
  );
  return hasWhole ? "whole" : "half";
};

// computed calendar grid math 
const currentMonthName = computed(() => monthNames[selectedMonthIndex.value]);

const calendarDays = computed(() => {
  const year = selectedYear.value;
  const month = selectedMonthIndex.value;

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const daysArray = [];

  // trailing previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    daysArray.push({
      dayNumber: totalDaysInPrevMonth - i,
      isCurrentMonth: false,
      dateString: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, "0")}-${String(totalDaysInPrevMonth - i).padStart(2, "0")}`,
    });
  }

  // active current month grid array
  for (let i = 1; i <= totalDaysInMonth; i++) {
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateString: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
    });
  }

  // leading trailing next month padding
  const totalSlots = Math.ceil(daysArray.length / 7) * 7;
  const nextMonthPadding = totalSlots - daysArray.length;
  for (let i = 1; i <= nextMonthPadding; i++) {
    daysArray.push({
      dayNumber: i,
      isCurrentMonth: false,
      dateString: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
    });
  }

  return daysArray;
});

const selectedDayName = computed(() => {
  const dateObj = new Date(
    selectedYear.value,
    selectedMonthIndex.value,
    selectedDay.value,
  );
  return dateObj.toLocaleDateString("en-US", { weekday: "long" });
});

const selectedDateString = computed(
  () =>
    `${selectedYear.value}-${String(selectedMonthIndex.value + 1).padStart(2, "0")}-${String(selectedDay.value).padStart(2, "0")}`,
);

// Show events that cover the selected date (supporting multi-day ranges)
const selectedDayEvents = computed(() => {
  const target = selectedDateString.value;
  return eventsList.value.filter((e) => {
    const start = e.startDate || e.date;
    const end = e.endDate || start;
    return isDateInRange(target, start, end);
  });
});

// --- actions ---
const handleDayClick = (day) => {
  if (day.isCurrentMonth) {
    selectedDay.value = day.dayNumber;
  }
};

const selectYear = (year) => {
  selectedYear.value = year;
  showYearDropdown.value = false;
};

const selectMonth = (index) => {
  selectedMonthIndex.value = index;
  showMonthDropdown.value = false;
  const maxDays = new Date(selectedYear.value, index + 1, 0).getDate();
  if (selectedDay.value > maxDays) selectedDay.value = maxDays;
};

// arrow-button month navigation, handling year rollover at Jan/Dec.
const shiftMonth = (delta) => {
  let newMonth = selectedMonthIndex.value + delta;
  let newYear = selectedYear.value;

  if (newMonth < 0) {
    newMonth = 11;
    newYear -= 1;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear += 1;
  }

  selectedMonthIndex.value = newMonth;
  selectedYear.value = newYear;

  const maxDays = new Date(newYear, newMonth + 1, 0).getDate();
  if (selectedDay.value > maxDays) selectedDay.value = maxDays;
};
</script>

<template>
  <div
    class="w-full max-w-350 p-5 mt-10 bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] grid grid-cols-1 rounded-4xl lg:grid-cols-3 gap-6 font-poppins text-white px-4"
  >
    <!-- left panel: calendar dates -->
    <section
      class="lg:col-span-2 bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-3xl p-6 flex flex-col justify-between"
    >
      <div>
        <!-- date selector toggles -->
        <div class="flex items-center gap-5 mb-6 relative flex-wrap">
          <button
            @click="shiftMonth(-1)"
            aria-label="Previous month"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            ‹
          </button>

          <!-- year dropdown -->
          <div class="relative">
            <button
              @click="
                showYearDropdown = !showYearDropdown;
                showMonthDropdown = false;
              "
              class="flex items-center space-x-1.5 text-lg font-semibold text-[rgba(255,255,255,0.95)] hover:text-white transition"
            >
              <span>{{ selectedYear }}</span>
              <span class="text-xs text-[rgba(255,255,255,0.4)]">▼</span>
            </button>
            <div
              v-if="showYearDropdown"
              class="absolute left-0 mt-2 w-28 bg-[#16221d] border border-[rgba(255,255,255,0.15)] rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto backdrop-blur-lg"
            >
              <button
                v-for="y in [2024, 2025, 2026, 2027, 2028]"
                :key="y"
                @click="selectYear(y)"
                class="w-full text-left px-4 py-2 text-sm text-[rgba(255,255,255,0.8)] hover:bg-white/10 transition"
              >
                {{ y }}
              </button>
            </div>
          </div>

          <!-- month dropdown -->
          <div class="relative">
            <button
              @click="
                showMonthDropdown = !showMonthDropdown;
                showYearDropdown = false;
              "
              class="flex items-center space-x-1.5 text-lg font-semibold text-[rgba(255,255,255,0.95)] hover:text-white transition"
            >
              <span>{{ currentMonthName }}</span>
              <span class="text-xs text-[rgba(255,255,255,0.4)]">▼</span>
            </button>
            <div
              v-if="showMonthDropdown"
              class="absolute left-0 mt-2 w-36 bg-[#16221d] border border-[rgba(255,255,255,0.15)] rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto backdrop-blur-lg"
            >
              <button
                v-for="(m, idx) in monthNames"
                :key="m"
                @click="selectMonth(idx)"
                class="w-full text-left px-4 py-2 text-sm text-[rgba(255,255,255,0.8)] hover:bg-white/10 transition"
              >
                {{ m }}
              </button>
            </div>
          </div>

          <button
            @click="shiftMonth(1)"
            aria-label="Next month"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            ›
          </button>

          <span
            v-if="isLoadingEvents"
            class="text-[11px] text-[rgba(255,255,255,0.35)]"
            >Loading events…</span
          >
          <span v-else-if="eventsError" class="text-[11px] text-red-300">{{
            eventsError
          }}</span>
        </div>

        <!-- weekdays -->
        <div
          class="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-[rgba(255,255,255,0.45)] mb-4 border-b border-white/5 pb-2 tracking-wide"
        >
          <div v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>

        <!-- numeric dates grid-->
        <div
          class="grid grid-cols-7 gap-y-5 text-center items-center justify-items-center"
        >
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            @click="handleDayClick(day)"
            class="relative w-10 h-12 flex flex-col items-center justify-start pt-1.5 rounded-xl cursor-pointer transition select-none group"
            :class="[
              !day.isCurrentMonth
                ? 'text-white/20 pointer-events-none'
                : 'text-[rgba(255,255,255,0.85)]',
              day.isCurrentMonth && day.dayNumber === selectedDay
                ? 'bg-white/15 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-white'
                : 'hover:bg-white/5',
            ]"
          >
            <span class="text-sm font-medium z-10">{{
              String(day.dayNumber).padStart(2, "0")
            }}</span>

            <!-- status dots: emerald = whole day, amber = half day, grey = finished -->
            <span
              v-if="day.isCurrentMonth && statusForDate(day.dateString)"
              class="absolute bottom-1.5 w-1.5 h-1.5 rounded-full"
              :class="{
                'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]':
                  statusForDate(day.dateString) === 'whole',
                'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]':
                  statusForDate(day.dateString) === 'half',
                'bg-white/30': statusForDate(day.dateString) === 'finished',
              }"
            ></span>
          </div>
        </div>
      </div>
    </section>

    <!-- right panel -  day info -->
    <section
      class="bg-[rgba(255,255,255,0.02)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-3xl p-6 flex flex-col justify-between text-center max-h-[calc(100vh-5rem)] overflow-y-auto"
    >
      <div>
        <h3
          class="text-[rgba(255,255,255,0.45)] text-medium font-medium tracking-widest uppercase mt-2 mb-4"
        >
          {{ currentMonthName }}
        </h3>

        <h1
          class="text-9xl font-4xl tracking-tight text-white my-3 select-none"
        >
          {{ String(selectedDay).padStart(2, "0") }}
        </h1>

        <p class="text-[rgba(255,255,255,0.75)] text-md tracking-wide mb-4">
          {{ selectedDayName }}
        </p>

        <div class="py-4 text-xs tracking-wide">
          <p v-if="isLoadingEvents" class="text-[rgba(255,255,255,0.3)]">
            Loading events…
          </p>
          <p
            v-else-if="selectedDayEvents.length === 0"
            class="text-[rgba(255,255,255,0.3)]"
          >
            No scheduled event.
          </p>

          <!-- display events for the selected day -->
          <div v-else class="flex flex-col gap-y-3 text-left">
            <div
              v-for="event in selectedDayEvents"
              :key="event.id"
              class="bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
            >
              <p class="text-white font-medium text-sm">{{ event.name || event.title }}</p>
              <p class="text-[rgba(255,255,255,0.5)] text-[11px] mt-1">
                {{ event.startTime || "Time TBD"
                }}{{ event.endTime ? ` – ${event.endTime}` : "" }} •
                {{ event.location || "Location TBD" }}
              </p>
              <span
                class="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                :class="{
                  'bg-emerald-400/20 text-emerald-300':
                    statusForEvent(event) === 'whole',
                  'bg-amber-400/20 text-amber-300':
                    statusForEvent(event) === 'half',
                  'bg-white/10 text-white/50':
                    statusForEvent(event) === 'finished',
                }"
              >
                {{
                  statusForEvent(event) === "finished"
                    ? "Finished"
                    : statusForEvent(event) === "whole"
                      ? "Whole Day"
                      : "Half Day"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <RouterLink
          :to="{ path: '/eventcaldetails', query: { date: selectedDateString } }"
          class="flex items-center justify-center w-full h-11 text-md font-normal tracking-wide text-[rgba(255,255,255,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.08))] border border-[rgba(255,255,255,0.15)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.12))] active:bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.16))] transition-all duration-200 rounded-full mb-6 shadow-sm"
        >
          Schedule New Event
        </RouterLink>
        <!-- legends -->
        <div
          class="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10px] text-[rgba(255,255,255,0.4)]"
        >
          <div class="flex items-center space-x-1.5">
            <span
              class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]"
            ></span>
            <span>Whole Day</span>
          </div>
          <div class="flex items-center space-x-1.5">
            <span
              class="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]"
            ></span>
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