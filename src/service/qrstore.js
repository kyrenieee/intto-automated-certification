import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useQrStore = defineStore("qr", () => {
  const currentToken = ref("");
  const activeEventId = ref("");
  let intervalId = null;

  const rollingUrl = computed(() => {
    return `${window.location.origin}/claim/${activeEventId.value}?token=${currentToken.value}`;
  });

  const generateToken = () => {
    currentToken.value = Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // pass event id
  const startRollingQr = (eventId) => {
    activeEventId.value = eventId;
    generateToken(); 
    intervalId = setInterval(() => {
      generateToken();
    }, 15000); // 15 seconds
  };

  const stopRollingQr = () => {
    if (intervalId) clearInterval(intervalId);
    activeEventId.value = "";
  };

  return { rollingUrl, startRollingQr, stopRollingQr };
});