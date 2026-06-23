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


<template>
  <div>
    <h1 class="text-black p-3">settings 'to</h1>
    <div class="flex flex-col items-center justify-center gap-4">
      <LiquidGlass class="bg-[#ffffff]/10 flex items-center justify-center rounded-4xl" style="padding: 1rem; width: 200px; height: 50px;">
  
      <RouterLink to="./login" class="text-gray-800 text-lg font-poppins px-5 py-2 rounded-4xl" >Logout</RouterLink></LiquidGlass>
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

