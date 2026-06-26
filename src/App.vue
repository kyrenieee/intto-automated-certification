<script setup>
import navbar from './components/navbar.vue'
import settings from './components/admin/settings.vue'


import { useDocuStore } from './service/docustore.js';
import { onMounted } from 'vue'
// will be ran once when the component is mounted
// prevent looping by checking if the documents have already been fetched
onMounted(() => {
        const docuStore = useDocuStore();
        docuStore.readDocument();
    });
    // if routerview=login, then hide navbar
    
    
</script>

<template>
<main>
    <div class="bg-[#1C2D27] p-4 gap-4 relative font-poppins min-h-screen place-items-center overflow-hidden sm:p-8 bg-[radial-gradient(circle_at_top_left,rgba(98,132,110,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(177,201,186,0.08),transparent_28%),linear-gradient(180deg,#13211c_0%,#17251f_45%,#10201a_100%)]">
        <navbar/>
        <RouterView/>
    </div>
    
</main>
</template>

<script>

</script>
