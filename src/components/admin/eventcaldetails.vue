<template>
  <div class="w-full max-w-[1200px] mx-auto flex flex-col gap-y-6">
    <StepHeader :current-step="currentStep" :total-steps="4" />

    <Step1Details
      v-if="currentStep === 1"
      :event-form="eventForm"
      @next="goNext"
    />
    <Step2Template
      v-if="currentStep === 2"
      :event-form="eventForm"
      @next="goNext"
      @back="goBack"
    />
    <Step3Preview
      v-if="currentStep === 3"
      :event-form="eventForm"
      @next="goNext"
      @back="goBack"
    />
    <Step4Response
      v-if="currentStep === 4"
      :event-form="eventForm"
      @submit="saveEvent"
      @back="goBack"
    />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import StepHeader from './steps/stepheader.vue'
import Step1Details from './steps/1-details.vue'
import Step2Template from './steps/2-template.vue'
import Step3Preview from './steps/3-prev.vue'
import Step4Response from './steps/4-response.vue'

export default {
  name: 'EventCalDetails',
  components: {
    StepHeader,
    Step1Details,
    Step2Template,
    Step3Preview,
    Step4Response,
  },
  setup() {
    const currentStep = ref(1)

    // single shared reactive object, passed to every step as a plain prop.
    const eventForm = reactive({
      name: '',
      endDate: '',
      endTime: '',
      location: '',
      templateFile: null,
      templateUrl: null,
      templatePublicId: null,
      variableMap: {},
      questions: [],
    })

    const goNext = () => {
      if (currentStep.value < 4) currentStep.value++
    }

    const goBack = () => {
      if (currentStep.value > 1) currentStep.value--
    }

    const saveEvent = () => {
      // 4-response.vue's handleCreateEvent already persists the event to Firestore and redirects to /events-all - nothing left to do here except reset this wizard's local state, so if the user ever lands back on /eventcaldetails  it starts a fresh event instead of showing the one that was just created.
      currentStep.value = 1
      Object.assign(eventForm, {
        name: '',
        endDate: '',
        endTime: '',
        location: '',
        templateFile: null,
        templateUrl: null,
        templatePublicId: null,
        variableMap: {},
        questions: [],
      })
    }

    return {
      currentStep,
      eventForm,
      goNext,
      goBack,
      saveEvent,
    }
  },
}
</script>

<style scoped>
</style>