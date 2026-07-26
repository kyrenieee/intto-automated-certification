<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <!-- settings container -->
  <main
    class="w-full max-w-350 mx-auto p-10 rounded-4xl mt-10 text-white bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col"
  >
    <h1 class="text-2xl font-medium mb-10">Settings</h1>

    <div class="space-y-8">
      <!-- profile section -->
      <section>
        <h2 class="text-lg font-medium mb-4 text-gray-300">Profile</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Organization Name</span>
            <span>UC InTTO</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Contact Email</span>
            <span>intto@uc-bcf.edu.ph</span>
          </div>
        </div>
      </section>

      <!-- certificate defaults section -->
      <section>
        <h2 class="text-lg font-medium mb-4 text-gray-300">
          Certificate Defaults
        </h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Default Template</span>
            <span>intto_cert.pdf</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-400">Output Format</span>
            <span>A4 Landscape</span>
          </div>
        </div>
      </section>

      <!-- survey settings section -->
      <section>
        <h2 class="text-lg font-medium mb-4 text-gray-300">Survey Settings</h2>
        <div class="flex justify-between items-center">
          <span class="text-gray-400">Require survey by default</span>
          <ToggleSwitch />
        </div>
      </section>
    </div>
   
  </main>
</template>