 <!-- transfer eventcal-det here and
 transfer this  there: 
<template>
  <div>
    step header
    <StepHeader :current-step="currentStep" />

    
    <Step1Details  v-if="currentStep === 1" @next="currentStep++" />
    <Step2Template v-if="currentStep === 2" @next="currentStep++" />
    <Step3Preview  v-if="currentStep === 3" @next="currentStep++" />
    <Step4Response v-if="currentStep === 4" @submit="saveEvent" />
  </div>
</template> -->


