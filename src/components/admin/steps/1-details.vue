<template>
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
        :disabled="!isValid"
        class="flex items-center gap-2 px-6 h-11 bg-transparent hover:bg-white/5 active:bg-white/10 border border-white/10 rounded-full text-xs font-medium tracking-wide text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
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

    <form class="w-full flex flex-col gap-y-6 text-left" @submit.prevent>
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

      <!-- Grid Row for Start Date, Start Time, End Date, and End Time -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <label class="flex flex-col gap-y-2">
          <span
            class="text-sm font-semibold tracking-wide text-[rgba(255,255,255,0.95)]"
            >Event Start Date*</span
          >
          <input
            v-model="eventForm.startDate"
            type="date"
            readonly
            disabled
            class="w-full h-12 px-6 bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.15)] text-sm rounded-full outline-none transition-all duration-200 text-white/50 cursor-not-allowed color-scheme-dark"
          />
        </label>

        <label class="flex flex-col gap-y-2">
          <span
            class="text-sm font-semibold tracking-wide text-[rgba(255,255,255,0.95)]"
            >Event Start Time*</span
          >
          <input
            v-model="eventForm.startTime"
            type="time"
            class="w-full h-12 px-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.35)] focus:border-[rgba(255,255,255,0.7)] text-sm rounded-full outline-none transition-all duration-200 text-white color-scheme-dark"
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
      </div>

      <!-- Schedule feedback notes -->
      <div>
        <p v-if="scheduleError" class="text-xs text-red-300 mt-1">
          {{ scheduleError }}
        </p>
        <p v-else-if="eventForm.endTime" class="text-xs text-gray-400 mt-1">
          This will show as a
          <span
            :class="
              durationType === 'whole' ? 'text-emerald-300' : 'text-amber-300'
            "
          >
            {{ durationType === "whole" ? "Whole Day" : "Half Day" }}
          </span>
          event (ends {{ durationType === "whole" ? "after" : "by" }}
          {{ cutoffLabel }}).
        </p>
        <p v-if="wholeDayConflict" class="text-xs text-amber-300 mt-1">
          ⚠ This date already has a whole-day event booked - you won't be able
          to create this event unless you pick a different date.
        </p>
      </div>

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
            @blur="hideLocationPickerDelayed"
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

        <!-- overlay menu emerg glass -->
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
import { ref, computed, onMounted } from "vue";
import {
  getDurationType,
  hasWholeDayConflict,
  WHOLE_DAY_CUTOFF_LABEL,
  isWithinOfficeHours,
} from "../../../utils/Eventscheduling";

const MOCK_PLACES = [
  "University of the Cordilleras",
  "University of the Cordillera, Auditorium",
  "University of the Cordilleras,Theater",
  "University of the Cordilleras, Gym",
  "University of the Cordilleras, InTTO",
  "University of the Cordilleras, Canao Hall",
];

export default {
  name: "Step1Details",
  props: {
    eventForm: {
      type: Object,
      required: true,
    },
    existingEvents: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["next"],
  setup(props, { emit }) {
    const isSearching = ref(false);
    const showLocationPicker = ref(false);
    const locationResults = ref([]);
    let searchTimeout = null;

    onMounted(() => {
      if (!props.eventForm.startDate) {
        const todayStr = new Date().toISOString().split("T")[0];
        props.eventForm.startDate = todayStr;
      }
    });

    const handleLocationInput = (e) => {
      const value = e.target.value;
      props.eventForm.location = value;
      showLocationPicker.value = true;

      clearTimeout(searchTimeout);
      if (!value.trim()) {
        locationResults.value = [];
        isSearching.value = false;
        return;
      }

      isSearching.value = true;
      searchTimeout = setTimeout(() => {
        locationResults.value = MOCK_PLACES.filter((place) =>
          place.toLowerCase().includes(value.toLowerCase())
        );
        isSearching.value = false;
      }, 300);
    };

    const selectLocation = (place) => {
      props.eventForm.location = place;
      locationResults.value = [];
      showLocationPicker.value = false;
    };

    const hideLocationPickerDelayed = () => {
      setTimeout(() => {
        showLocationPicker.value = false;
      }, 250);
    };

    const scheduleError = computed(() => {
      const { startDate, startTime, endDate, endTime } = props.eventForm;
      if (!startDate || !endDate) return "";

      if (startDate > endDate)
        return "Start date must be on or before the end date.";

      if (startTime && endTime) {
        if (!isWithinOfficeHours(startTime, endTime)) {
          return "Events must be scheduled within office hours (8:00 AM – 5:00 PM)."
        }
        if (startDate === endDate && startTime >= endTime) {
          return "End time must be after start time.";
        }
      }
      return "";
    });

    const durationType = computed(() =>
      getDurationType(props.eventForm.endTime)
    );
    const cutoffLabel = WHOLE_DAY_CUTOFF_LABEL;

    const wholeDayConflict = computed(() =>
      hasWholeDayConflict(props.existingEvents, props.eventForm.endDate)
    );

    const isValid = computed(
      () =>
        Boolean(
          props.eventForm.name &&
            props.eventForm.startDate &&
            props.eventForm.startTime &&
            props.eventForm.endDate &&
            props.eventForm.endTime &&
            props.eventForm.location
        ) && !scheduleError.value
    );

    const handleNextStep = () => {
      if (!isValid.value) return;
      emit("next");
    };

    return {
      eventForm: props.eventForm,
      isSearching,
      showLocationPicker,
      locationResults,
      handleLocationInput,
      selectLocation,
      hideLocationPickerDelayed,
      scheduleError,
      durationType,
      cutoffLabel,
      wholeDayConflict,
      isValid,
      handleNextStep,
    };
  },
};
</script>

<style scoped></style>
