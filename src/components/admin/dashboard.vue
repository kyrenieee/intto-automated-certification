<script>
import { LiquidGlass } from '@wxperia/liquid-glass-vue';

export default {
    setup () {
        

        return {}
    }
}
</script>

<template>
    <section class="flex flex-col bg-[#1C2D27] p-4 gap-4 relative font-poppins min-h-screen place-items-center overflow-hidden sm:p-8 bg-[radial-gradient(circle_at_top_left,rgba(98,132,110,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(177,201,186,0.08),transparent_28%),linear-gradient(180deg,#13211c_0%,#17251f_45%,#10201a_100%)]">
        <div class="flex flex-col">
            <!-- change into empty space? -->
            <div class="justify-items-end flex gap-4 w-full px-4 sm:px-8 bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-4xl">
                <RouterLink to="/eventcal" class="  text-white px-4 py-2 rounded-4xl">blank space 
                </RouterLink>
               
            </div>
            <div class="justify-items-end flex gap-4 w-full px-4 sm:px-8 bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-4xl">
                <RouterLink to="/eventcal" class="  text-white px-4 py-2 rounded-4xl">Schedule New Event  
                </RouterLink>
                <!-- + svg -->
            </div>
        <div class="flex justify-around gap-4">
            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]">card</div>
            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]">card</div>
            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]">card</div>
            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)]">card</div>
            <!-- what the hell is happening -->
        </div>
    </div>
    </section>
</template>

