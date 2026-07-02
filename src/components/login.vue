<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore} from "../service/docuauth";
import { LiquidGlass } from "@wxperia/liquid-glass-vue";

const router = useRouter();
const authStore = useAuthStore();
const username = ref("");
const password = ref("");

// will trigger when form is submitted
const handleLogin = async () => {
// pass input values to pinia
  await authStore.loginUser(username.value, password.value);

// no error -> dashboard
  if (!authStore.errorMsg) {
    router.push('/dashboard');
  }
};

</script>

<!-- zai -->
<template>
  <section
    class="relative font-poppins w-full min-h-screen grid place-items-center overflow-hidden p-4 sm:p-8 ]"
  >
    <!-- bg blurs-->
    <div
      class="absolute inset-auto rounded-full blur-3xl opacity-35 pointer-events-none w-88 height-[22rem] -left-24 -top-20 bg-[rgba(92,126,104,0.35)]"
    ></div>
    <div
      class="absolute inset-auto rounded-full blur-3xl opacity-35 pointer-events-none w-[18rem] height-[18rem] -right-20 -bottom-16 bg-[rgba(196,214,201,0.16)]"
    ></div>

    <!-- glass card -->
    <div
      class="relative w-[min(100%,47rem)] rounded-xl sm:rounded-4xl bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]"
    >
      <div
        class="p-6 sm:p-[clamp(2rem,5vw,4rem)] grid gap-6 sm:gap-8 justify-items-center"
      >
        <!-- logo -->
        <div class="flex justify-center">
          <img
            src="../assets/inttologo.png"
            alt="Intto logo"
            class="w-[min(13rem,42vw)] object-contain brightness-[1.2] contrast-[1.05]"
          />
        </div>

        <!-- form -->
        <form class="w-[min(100%,38rem)] grid gap-5 sm:gap-7" @submit.prevent="handleLogin">
          <!-- user field-->
          <label class="grid gap-[0.55rem]">
            <span
              class="text-center text-[rgba(255,255,255,0.95)] font-poppins text-[clamp(1.05rem,1vw+0.8rem,1.25rem)] font-semibold tracking-[0.01em]"
            >
              Username
            </span>
            <input
              v-model="username"
              type="email"
              autocomplete="username"
              placeholder="inttoadmin@autocert.com"
              required
              class="w-full h-12 sm:h-13 rounded-full border border-[rgba(255,255,255,0.52)] bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.92)] text-center text-base outline-none transition-all duration-200 ease-in-out placeholder:text-[rgba(255,255,255,0.22)] focus:border-[rgba(255,255,255,0.82)] focus:bg-[rgba(255,255,255,0.07)] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
            />
          </label>

          <!-- password field -->
          <label class="grid gap-[0.55rem]">
            <span
              class="text-center text-[rgba(255,255,255,0.95)] font-poppins text-[clamp(1.05rem,1vw+0.8rem,1.25rem)] font-semibold tracking-[0.01em]"
            >
              Password
            </span>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              required
              class="w-full h-12 sm:h-13 rounded-full border border-[rgba(255,255,255,0.52)] bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.92)] text-center text-base outline-none transition-all duration-200 ease-in-out placeholder:text-[rgba(255,255,255,0.22)] focus:border-[rgba(255,255,255,0.82)] focus:bg-[rgba(255,255,255,0.07)] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
            />
          </label>

          <!-- if not authenticated user, this will pop up -->

          <div v-if="authStore.errorMsg" class="text-center text-[#ff6b6b] text-sm font-medium mt-1.5">
            {{ authStore.errorMsg }}
          </div>
          <!-- submit button -->
          <button
            type="submit"
            class="justify-self-center min-w-40 h-12 px-8 border border-[rgba(255,255,255,0.2)] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] text-[rgba(255,255,255,0.95)] font-poppins text-[1.05rem] font-light hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.12))] active:bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.16))] transition-all duration-200 ease-in-out cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
