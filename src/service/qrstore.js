import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQrStore = defineStore('qr', () => {
  const currentToken = ref('')
  let intervalId = null

  // dummy url
  const rollingUrl = computed(() => {
    return `dummyurl.com=${currentToken.value}`
  })

  // Function to generate a random 8-character string
  const generateToken = () => {
    currentToken.value = Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  // rolling timer
  const startRollingQr = () => {
    generateToken() // Generate first token immediately
    // Update the token every 30 seconds
    intervalId = setInterval(() => {
      generateToken()
    }, 30000) 
  }

  // Clean up the timer when we leave the page
  const stopRollingQr = () => {
    if (intervalId) clearInterval(intervalId)
  }

  return { rollingUrl, startRollingQr, stopRollingQr }
})