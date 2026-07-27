import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { setLiveToken } from "./docustore";

const ROTATION_INTERVAL_MS = 30000;
const TOKEN_TTL_MS = ROTATION_INTERVAL_MS * 3 + 5000;

export const useQrStore = defineStore("qr", () => {
  const currentToken = ref("");
  const activeEventId = ref("");
  let tokenHistory = [];
  let intervalId = null;

  const rollingUrl = computed(() => {
    return `${window.location.origin}/claim/${activeEventId.value}?token=${currentToken.value}`;
  });

  const generateToken = () => {
    currentToken.value = Math.random().toString(36).substring(2, 10).toUpperCase();

    // publish it so mobileview.vue's validateScan() has something to check the scanned token against. Fire-and-forget: a slow/failed write 
    const now = Date.now();
    tokenHistory = tokenHistory.filter((t) => t.expiresAt > now);
    tokenHistory.push({ token: currentToken.value, expiresAt: now + TOKEN_TTL_MS});
    
    if (activeEventId.value) {
      setLiveToken(activeEventId.value, tokenHistory);
    }
  };

  // pass event id
  const startRollingQr = (eventId) => {
    activeEventId.value = eventId;
    tokenHistory = [];
    generateToken();
    intervalId = setInterval(() => {
      generateToken();
    }, ROTATION_INTERVAL_MS);

  };

  const stopRollingQr = () => {
    if (intervalId) clearInterval(intervalId);
    activeEventId.value = "";
    tokenHistory = [];
  };

  return { rollingUrl, startRollingQr, stopRollingQr };
});