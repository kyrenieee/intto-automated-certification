<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { createEventInFirestore } from "../../../service/docustore";
import {
  getDurationType,
  hasWholeDayConflict,
} from "../../../utils/Eventscheduling";

const props = defineProps({
  eventForm: {
    type: Object,
    required: true,
  },
  existingEvents: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["submit", "back"]);

const router = useRouter();
let nextId = 1;

// initialize its questions array in place rather than keeping a disconnected
if (!props.eventForm.questions || props.eventForm.questions.length === 0) {
  props.eventForm.questions = [
    { id: nextId++, type: "text", text: "What is your full name?" },
    {
      id: nextId++,
      type: "choice",
      text: "What is your age?",
      options: ["18 - 24", "25 - 34", "35 - 44", "45 - 54", "55 - 64", "65+"],
    },
    {
      id: nextId++,
      type: "rating",
      text: "How would you rate this event overall?",
    },
    {
      id: nextId++,
      type: "choice",
      text: "Which department are you affliated with",
      options: [
        "CITCS",
        "CBA",
        "COE",
        "CAS",
        "CTE",
        "CAFA",
        "CONAHS",
        "ÇHTM",
        "CCJE",
        "COL",
        "COA",
      ],
    },
  ];
} else {
  nextId = Math.max(...props.eventForm.questions.map((q) => q.id)) + 1;
}

const addQuestion = (type) => {
  const base = { id: nextId++, type, text: "" };
  if (type === "choice") base.options = ["Option 1", "Option 2"];
  props.eventForm.questions.push(base);
};

const removeQuestion = (index) => {
  props.eventForm.questions.splice(index, 1);
};

const addOption = (questionIndex) => {
  const q = props.eventForm.questions[questionIndex];
  if (!q.options) q.options = [];
  q.options.push(`Option ${q.options.length + 1}`);
};

const removeOption = (questionIndex, optionIndex) => {
  const q = props.eventForm.questions[questionIndex];
  if (q.options.length <= 1) return;
  q.options.splice(optionIndex, 1);
};

// a whole-day event already booked on this date blocks creating another one.
const wholeDayConflict = computed(() =>
  hasWholeDayConflict(props.existingEvents, props.eventForm.endDate),
);

const handleCreateEvent = async () => {
  if (wholeDayConflict.value) {
    alert(
      "This date already has a whole-day event booked. Go back to Step 1 and pick a different date.",
    );
    return;
  }

  try {
    const newEvent = {
      title: props.eventForm?.name || "Untitled Event",
      startDate: props.eventForm?.startDate || "",
      startTime: props.eventForm?.startTime || "",
      // 'date' stays the key the calendar groups events by (kept for
      // backwards compatibility with existing records/queries).
      date: props.eventForm?.endDate || "",
      endTime: props.eventForm?.endTime || "",
      durationType: getDurationType(props.eventForm?.endTime),
      location: props.eventForm?.location || "",
      scans: "0",
      certs: "0",
      survey: "0%",
    };
    await createEventInFirestore(newEvent);
    router.push("/events-all");
  } catch (error) {
    alert("Failed to create event. Please try again.");
    console.error(error);
  }
};

// handles the submit event from the template
const handleSubmit = () => {
  handleCreateEvent();
  emit("submit");
};
</script>

<template>
  <main
    class="w-full bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-4xl p-8 sm:p-12 text-white font-['Poppins'] select-none"
  >
    <!-- header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10"
    >
      <div>
        <h1 class="text-3xl sm:text-[44px] font-bold tracking-tight">
          Survey Builder
        </h1>
        <p class="text-base sm:text-lg text-gray-300 mt-1">
          Collect feedback from participants.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="$emit('back')"
          class="border border-white/20 rounded-full px-5 py-3 text-sm font-medium hover:bg-white/10 transition cursor-pointer"
        >
          Back
        </button>
        <button
          @click="handleSubmit"
          :disabled="wholeDayConflict"
          class="flex items-center gap-2 border border-white/30 rounded-full px-6 py-3 text-base font-medium hover:bg-white/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Create Event
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <p
      v-if="wholeDayConflict"
      class="text-sm text-amber-300 bg-amber-400/10 border border-amber-300/30 rounded-2xl px-4 py-3 mb-8"
    >
      ⚠ {{ eventForm.endDate }} already has a whole-day event booked, so this
      event can't be created. Go back to Step 1 and choose a different date.
    </p>

    <!-- questions collection -->
    <div class="flex flex-col gap-5 mb-8">
      <div
        v-for="(question, index) in eventForm.questions"
        :key="question.id"
        class="flex items-start bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/5 transition group"
      >
        <div
          class="grid grid-cols-2 gap-0.5 text-gray-500 group-hover:text-gray-300 mr-5 mt-1.5 cursor-grab"
        >
          <div
            class="w-1 h-1 bg-current rounded-full"
            v-for="n in 6"
            :key="n"
          ></div>
        </div>

        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span
              class="inline-block bg-[#0e3a2f] text-[#4ade80] text-xs font-semibold px-2.5 py-1 rounded-md mb-2"
            >
              Question {{ index + 1 }}
            </span>
            <button
              @click="removeQuestion(index)"
              class="text-xs text-white/30 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          </div>

          <input
            v-model="question.text"
            type="text"
            placeholder="Type your question..."
            class="w-full bg-transparent text-xl font-medium mb-3 outline-none border-b border-transparent focus:border-white/20 pb-1"
          />

          <!-- text answer -->
          <div
            v-if="question.type === 'text'"
            class="w-full border border-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm bg-transparent"
          >
            Participant's answer...
          </div>

          <!-- multi choice -->
          <div
            v-else-if="question.type === 'choice'"
            class="flex flex-wrap gap-2.5 items-center"
          >
            <div
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              class="flex items-center gap-1.5 border border-white/20 bg-white/5 rounded-full pl-4 pr-2 py-1.5"
            >
              <input
                v-model="question.options[optIndex]"
                type="text"
                placeholder="Option"
                class="bg-transparent text-sm font-medium outline-none w-24 sm:w-28"
              />
              <button
                v-if="question.options.length > 1"
                type="button"
                @click="removeOption(index, optIndex)"
                class="text-white/30 hover:text-red-300 text-xs w-4 h-4 flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              @click="addOption(index)"
              class="flex items-center gap-1 border border-dashed border-white/20 hover:border-white/40 rounded-full px-3 py-1.5 text-xs text-white/50 hover:text-white transition cursor-pointer"
            >
              + Option
            </button>
          </div>

          <!-- rating -->
          <div v-else-if="question.type === 'rating'" class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-yellow-400 transition cursor-pointer"
            >
              <svg class="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.582 1.847l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.778-.595-.38-1.847.582-1.847h4.907a1 1 0 00.95-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <p v-if="eventForm.questions.length === 0" class="text-sm text-gray-400">
        No questions yet — add one below.
      </p>
    </div>

    <!-- bottom workspace controls -->
    <div
      class="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6"
    >
      <button
        @click="addQuestion('rating')"
        class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Rating Scale
      </button>
      <button
        @click="addQuestion('choice')"
        class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Multiple Choice
      </button>
      <button
        @click="addQuestion('text')"
        class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Text Answer
      </button>
    </div>
  </main>
</template>

<style scoped></style>
