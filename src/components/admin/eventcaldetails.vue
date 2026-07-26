<template>
  <div class="w-full mt-10 flex flex-col gap-y-6">
    <StepHeader :current-step="currentStep" :total-steps="4" />

    <Step1Details
      v-if="currentStep === 1"
      :event-form="eventForm"
      :existing-events="existingEvents"
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
      :existing-events="existingEvents"
      @submit="saveEvent"
      @back="goBack"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import StepHeader from "./steps/stepheader.vue";
import Step1Details from "./steps/1-details.vue";
import Step2Template from "./steps/2-template.vue";
import Step3Preview from "./steps/3-prev.vue";
import Step4Response from "./steps/4-response.vue";
import { fetchAllEvents } from "../../service/docustore";

export default {
  name: "EventCalDetails",
  components: {
    StepHeader,
    Step1Details,
    Step2Template,
    Step3Preview,
    Step4Response,
  },
  setup() {
    const route = useRoute();
    const currentStep = ref(1);

    const eventForm = reactive({
      name: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      templateFile: null,
      templateUrl: null,
      templatePublicId: null,
      variableMap: {},
      questions: [],
    });

    const existingEvents = ref([]);
    
    onMounted(async () => {
      // Grab date from query parameter if passed from calendar view, otherwise default to today
      const pickedDate = route.query.date || new Date().toISOString().split("T")[0];
      eventForm.startDate = pickedDate;
      eventForm.endDate = pickedDate; // default end date to start date as well

      try {
        existingEvents.value = await fetchAllEvents();
      } catch (err) {
        console.error("Failed to load existing events for conflict check:", err);
      }
    });

    const goNext = () => {
      if (currentStep.value < 4) currentStep.value++;
    };

    const goBack = () => {
      if (currentStep.value > 1) currentStep.value--;
    };

    const saveEvent = () => {
      currentStep.value = 1;
      const fallbackDate = route.query.date || new Date().toISOString().split("T")[0];
      Object.assign(eventForm, {
        name: "",
        startDate: fallbackDate,
        startTime: "",
        endDate: fallbackDate,
        endTime: "",
        location: "",
        templateFile: null,
        templateUrl: null,
        templatePublicId: null,
        variableMap: {},
        questions: [],
      });
    };

    return {
      currentStep,
      eventForm,
      existingEvents,
      goNext,
      goBack,
      saveEvent,
    };
  },
};
</script>

<style scoped></style>
