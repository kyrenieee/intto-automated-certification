<script setup> //for imports only
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <section class="w-full text-white p-4 flex items-center justify-between px-15">
    <div class="flex-col items-center justify-items-center bg-white/10 rounded-4xl px-5 py-3"><img src="../assets/inttologo.png" alt="Intto Logo" width="50px" height="100px"></div>
  <div class="flex flex-col items-center justify-items-center">  
  <nav class="justify-center space-x-4 bg-white/10 rounded-4xl px-5 py-3">
    <RouterLink to="/dashboard" class="hover:bg-white/15 active:bg-black/30 text-white px-4 py-2 rounded-4xl" >Home</RouterLink>
    <RouterLink to="/active" class="hover:bg-white/15 active:bg-white/30 text-white px-4 py-2 rounded-4xl">Events</RouterLink>
    <RouterLink to="/settings" class="hover:bg-white/15 active:bg-white/30 text-white px-4 py-2 rounded-4xl">Settings</RouterLink>
    <RouterLink to="/eventcal" class="hover:bg-white/15 active:bg-white/30 text-white px-4 py-2 rounded-4xl">Add Event</RouterLink>
  </nav>
  </div>
  <div class="justify-items-center"><div class="round bg-black rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">UC</div></div>
  </section>
</template>

<script> //for logic only
export default { //ewan
  name: 'navbar',
  components: {
    RouterLink,
    RouterView
  },
  methods: {
      gotosettings() { //function to navigate to the settings page
        this.$router.push('/settings')
      },
    },
}
</script> 