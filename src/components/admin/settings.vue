<script setup>
import { ref, onMounted, onUnmounted } from 'vue' //unmounted - end of component lifecycle
import { useRouter } from 'vue-router'
import { useDocuStore } from '../../service/docustore';

onMounted(() => {
        const docuStore = useDocuStore();
        docuStore.fetchDocuments();
        docuStore.readd
});

</script>


<template>
  <div>
    <h1 class="bg-primary text-black p-3">settings 'to</h1>
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

