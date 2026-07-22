import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { setLiveToken } from "./docustore";

const TOKEN_INTERVAL_MS = 60000; // 1 minute
// give a little slack past the interval so a token isn't rejected as
// "expired" the instant the next tick's write is still in flight.
const TOKEN_TTL_MS = TOKEN_INTERVAL_MS + 5000;

export const useQrStore = defineStore("qr", () => {
  const currentToken = ref("");
  const activeEventId = ref("");
  let intervalId = null;

  const rollingUrl = computed(() => {
    return `${window.location.origin}/claim/${activeEventId.value}?token=${currentToken.value}`;
  });

  const generateToken = () => {
    currentToken.value = Math.random().toString(36).substring(2, 10).toUpperCase();

    // publish it so mobileview.vue's validateScan() has something to check the scanned token against. Fire-and-forget: a slow/failed write 
    // shouldn't block the QR code from rendering on the admin's screen?
    if (activeEventId.value) {
      setLiveToken(activeEventId.value, currentToken.value, Date.now() + TOKEN_TTL_MS);
    }
  };

  // pass event id
  const startRollingQr = (eventId) => {
    activeEventId.value = eventId;
    generateToken(); 
    intervalId = setInterval(() => {
      generateToken();
    }, TOKEN_INTERVAL_MS);
  };

  const stopRollingQr = () => {
    if (intervalId) clearInterval(intervalId);
    activeEventId.value = "";
  };

  return { rollingUrl, startRollingQr, stopRollingQr };
});