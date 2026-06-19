<script setup>
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import HelloWorld from './components/HelloWorld.vue/index.js'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template >
  
  <header >

    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="header-content">
      <HelloWorld msg="Hello World!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>
