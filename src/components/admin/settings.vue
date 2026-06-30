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


<!-- zai -->
<template>
    <!-- settings container -->
    <main
      class="max-w-5xl w-full mx-auto p-10 rounded-4xl mt-12 text-white
             bg-[rgba(255,255,255,0.06)] backdrop-blur-md 
             border border-[rgba(255,255,255,0.12)] 
             shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <h1 class="text-2xl font-medium mb-10">Settings</h1>

      <div class="space-y-8">
        <!-- profile section -->
        <div>
          <h2 class="text-lg font-medium mb-4 text-gray-300">Profile</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Organization Name</span>
              <span>UC InTTO</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Contact Email</span>
              <span>—</span>
            </div>
          </div>
        </div>

        <!-- certificate defaults section -->
        <div>
          <h2 class="text-lg font-medium mb-4 text-gray-300">Certificate Defaults</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Default Template</span>
              <span>intto_cert.pdf</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Output Format</span>
              <span>A4 Landscape</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Auto-email on Generation</span>
              <ToggleSwitch />
            </div>
          </div>
        </div>

        <!-- survey settings section -->
        <div>
          <h2 class="text-lg font-medium mb-4 text-gray-300">Survey Settings</h2>
          <div class="flex justify-between items-center">
            <div class="flex justify-between items-center">
            <span class="text-gray-400">Require survey by default</span>
            <ToggleSwitch />
          </div>
          </div>
        </div>
      </div>
      <RouterLink to="/login" class="mt-10 inline-block px-6 py-3  text-white rounded-4xl bg-[rgba(255,255,255,0.06)] backdrop-blur-md 
             border border-[rgba(255,255,255,0.12)] 
             shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] transition">Logout</RouterLink>
    </main>


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

