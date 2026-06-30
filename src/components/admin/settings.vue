<script setup>
import { ref, onMounted, onUnmounted } from 'vue' //unmounted - end of component lifecycle
import { useRouter } from 'vue-router'
import { useDocuStore } from '../../service/docustore';
import { LiquidGlass } from '@wxperia/liquid-glass-vue'

onMounted(() => {
        const docuStore = useDocuStore();
        docuStore.fetchDocuments();
        docuStore.readd
});

</script>

<!-- zai -->
<template>
  <div class="w-full max-w-5xl flex flex-row p-5 px-4 bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] mx-auto rounded-4xl gap-6 text-white">
    <div class="flex flex-col">
      <div class="">0</div>

      <div class="flex flex-row w-full items-stretch gap-6">              
        <div>left</div>
        <div>right</div>
      </div>

      <div class="">3</div>
      <div class="">4</div>
      </div>
  </div>
</template>

<script>
  export default {
    methods: {
      gotosettings() { //function to navigate to the settings page
        this.$router.push('/settings')
      },
    },
  }
</script>

