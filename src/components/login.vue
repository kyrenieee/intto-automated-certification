<script setup>
import { ref } from 'vue'
import { LiquidGlass } from '@wxperia/liquid-glass-vue'

const username = ref('')
const password = ref('')
</script>

<template>
  <section class="relative font-poppins min-h-screen grid place-items-center overflow-hidden p-4 sm:p-8 bg-[radial-gradient(circle_at_top_left,rgba(98,132,110,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(177,201,186,0.08),transparent_28%),linear-gradient(180deg,#13211c_0%,#17251f_45%,#10201a_100%)]">
    
    <!-- Background Blurs -->
    <div class="absolute inset-auto rounded-full blur-[64px] opacity-35 pointer-events-none w-[22rem] height-[22rem] left-[-6rem] top-[-5rem] bg-[rgba(92,126,104,0.35)]"></div>
    <div class="absolute inset-auto rounded-full blur-[64px] opacity-35 pointer-events-none w-[18rem] height-[18rem] right-[-5rem] bottom-[-4rem] bg-[rgba(196,214,201,0.16)]"></div>

    <!-- Glass Login Card -->
    <div class="relative w-[min(100%,47rem)] rounded-xl sm:rounded-[2rem] bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]">
      <div class="p-6 sm:p-[clamp(2rem,5vw,4rem)] grid gap-6 sm:gap-8 justify-items-center">
        
        <!-- Logo -->
        <div class="flex justify-center">
          <img 
            src="../assets/inttologo.png" 
            alt="Intto logo" 
            class="w-[min(13rem,42vw)] object-contain brightness-[1.2] contrast-[1.05]" 
          />
        </div>

        <!-- Form -->
        <form class="w-[min(100%,38rem)] grid gap-5 sm:gap-[1.75rem]" @submit.prevent>
          
          <!-- Username Field -->
          <label class="grid gap-[0.55rem]">
            <span class="text-center text-[rgba(255,255,255,0.95)] font-[family:var(--font-poppins,Poppins,sans-serif)] text-[clamp(1.05rem,1vw+0.8rem,1.25rem)] font-semibold tracking-[0.01em]">
              Username
            </span>
            <input 
              v-model="username" 
              type="email" 
              autocomplete="username" 
              placeholder="inttoadmin@autocert.com" 
              class="w-full h-12 sm:h-[3.25rem] rounded-full border border-[rgba(255,255,255,0.52)] bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.92)] text-center text-base outline-none transition-all duration-200 ease-in-out placeholder:text-[rgba(255,255,255,0.22)] focus:border-[rgba(255,255,255,0.82)] focus:bg-[rgba(255,255,255,0.07)] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]" 
            />
          </label>

          <!-- Password Field -->
          <label class="grid gap-[0.55rem]">
            <span class="text-center text-[rgba(255,255,255,0.95)] font-[family:var(--font-poppins,Poppins,sans-serif)] text-[clamp(1.05rem,1vw+0.8rem,1.25rem)] font-semibold tracking-[0.01em]">
              Password
            </span>
            <input 
              v-model="password" 
              type="password" 
              autocomplete="current-password" 
              placeholder="••••••••" 
              class="w-full h-12 sm:h-[3.25rem] rounded-full border border-[rgba(255,255,255,0.52)] bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.92)] text-center text-base outline-none transition-all duration-200 ease-in-out placeholder:text-[rgba(255,255,255,0.22)] focus:border-[rgba(255,255,255,0.82)] focus:bg-[rgba(255,255,255,0.07)] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]" 
            />
          </label>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="justify-self-center min-w-[10rem] h-12 px-8 border border-[rgba(255,255,255,0.2)] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] text-[rgba(255,255,255,0.95)] font-[family:var(--font-poppins,Poppins,sans-serif)] text-[1.05rem] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_20px_rgba(0,0,0,0.18)] transition-all duration-200 ease-in-out hover:translate-y-[-1px] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.1))] active:translate-y-0"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </section>
</template>