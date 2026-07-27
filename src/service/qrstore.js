import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { setLiveToken } from "./docustore";

const ROTATION_INTERVAL_MS = 30000; // how often the displayed QR code changes
// A scanned token must stay valid well past its own rotation, since the
// scan -> camera hand-off -> page load -> Firestore round trip on a phone
// can easily take longer than one rotation interval. Give it enough slack
// to survive a couple of extra rotations rather than expiring the instant
// the QR moves on to the next code.
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

    const now = Date.now();
    tokenHistory = tokenHistory.filter((t) => t.expiresAt > now);
    tokenHistory.push({ token: currentToken.value, expiresAt: now + TOKEN_TTL_MS });

    // publish it so mobileview.vue's validateScan() has something to check the scanned token against. Fire-and-forget: a slow/failed write
    // shouldn't block the QR code from rendering on the admin's screen?
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