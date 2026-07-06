<template>
  <main class="w-full bg-[#23322e] rounded-[32px] p-8 sm:p-12 text-white font-['Poppins'] select-none">

    <!-- header -->
    <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
      <div>
        <h1 class="text-3xl sm:text-[44px] font-bold tracking-tight">Survey Builder</h1>
        <p class="text-base sm:text-lg text-gray-300 mt-1">Collect feedback from participants.</p>
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
          class="flex items-center gap-2 border border-white/30 rounded-full px-6 py-3 text-base font-medium hover:bg-white/10 transition cursor-pointer"
        >
          Create Event
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- questions collection -->
    <div class="flex flex-col gap-5 mb-8">
      <div
        v-for="(question, index) in localQuestions"
        :key="question.id"
        class="flex items-start bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] transition group"
      >
        <div class="grid grid-cols-2 gap-0.5 text-gray-500 group-hover:text-gray-300 mr-5 mt-1.5 cursor-grab">
          <div class="w-1 h-1 bg-current rounded-full" v-for="n in 6" :key="n"></div>
        </div>

        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span class="inline-block bg-[#0e3a2f] text-[#4ade80] text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
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
          <div v-if="question.type === 'text'" class="w-full border border-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm bg-transparent">
            Participant's answer...
          </div>

          <!-- multi choice -->
          <div v-else-if="question.type === 'choice'" class="flex flex-wrap gap-2.5">
            <span
              v-for="option in question.options"
              :key="option"
              class="border border-white/20 bg-white/5 px-4 py-2 rounded-full text-sm font-medium"
            >
              {{ option }}
            </span>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.582 1.847l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.778-.595-.38-1.847.582-1.847h4.907a1 1 0 00.95-.69l1.519-4.674z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <p v-if="localQuestions.length === 0" class="text-sm text-gray-400">
        No questions yet — add one below.
      </p>
    </div>

    <!-- bottom workspace controls -->
    <div class="flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
      <button
        @click="addQuestion('rating')"
        class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Rating Scale
      </button>
      <button
        @click="addQuestion('choice')"
        class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Multiple Choice
      </button>
      <button
        @click="addQuestion('text')"
        class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Text Answer
      </button>
    </div>
  </main>
</template>

<script>
import { reactive, watch } from 'vue'

let nextId = 1

export default {
  name: 'Step4Response',
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue', 'submit', 'back'],
  setup(props, { emit }) {
    const localQuestions = reactive(
      (props.modelValue.questions && props.modelValue.questions.length
        ? props.modelValue.questions
        : [
            { id: nextId++, type: 'text', text: 'What is your full name?' },
            {
              id: nextId++,
              type: 'choice',
              text: 'What is your age?',
              options: ['18 - 24', '25 - 34', '35 - 44', '45 - 54', '55 - 64', '65+'],
            },
            { id: nextId++, type: 'rating', text: 'How would you rate this event overall?' },
          ]
      ).map((q) => ({ ...q }))
    )

    const addQuestion = (type) => {
      const base = { id: nextId++, type, text: '' }
      if (type === 'choice') base.options = ['Option 1', 'Option 2']
      localQuestions.push(base)
    }

    const removeQuestion = (index) => {
      localQuestions.splice(index, 1)
    }

    watch(
      localQuestions,
      (val) => emit('update:modelValue', { ...props.modelValue, questions: [...val] }),
      { deep: true }
    )

    const handleSubmit = () => {
      emit('submit')
    }

    return { localQuestions, addQuestion, removeQuestion, handleSubmit }
  },
}
</script>

<style scoped>
</style>