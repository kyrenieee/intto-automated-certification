<script setup>
import navbar from './components/navbar.vue'
import settings from './components/admin/settings.vue'
import { defineStore } from 'pinia'
import { useDocuStore } from './service/docustore.js';
import { onMounted } from 'vue'
// will be ran once when the component is mounted
// prevent looping by checking if the documents have already been fetched
onMounted(() => {
        const docuStore = useDocuStore();
        docuStore.addDoc();
    });
</script>

<template>
<navbar class="bg-[#1C2D27]" />
<main >
    <RouterView />
    
</main>
</template>

<script>
    
</script>
