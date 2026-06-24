<script setup> //for imports only
    import { LiquidGlass } from '@wxperia/liquid-glass-vue';
    import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
    <div class="flex space-x-3">
        <RouterLink to="allevent" class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">All Events</RouterLink>
        <button class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">Active</button>
        <button class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">Completed</button>
        <button class="px-5 py-2 rounded-full text-sm font-medium border border-gray-500 text-white hover:bg-[#253931]">Upcoming</button>
    </div>
</template>
