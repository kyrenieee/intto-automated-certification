<script>
import { LiquidGlass } from '@wxperia/liquid-glass-vue';

export default {
    setup () {
        

        return {}
    }
}
</script>

<template>
    <section class="flex flex-col">
        <div class="flex flex-col gap-y-5">
            <div class="flex">
                <!-- empty space -->
                <div class="justify-items-endfl ex gap-4 w-5/6 px-4 sm:px-8 ] invisible rounded-4xl">
                </div>
                <!-- sched new event button -->
                <div class="justify-items-end flex gap-4 w-2/6 px-4 sm:px-8 bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-4xl">
                    <RouterLink to="/eventcal" class="   text-white px-4 py-2 rounded-4xl">Schedule New Event </RouterLink>
                    <!-- + svg -->
                    
        
                </div>
            </div> 
        <div class="flex justify-around text-white gap-4">
            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl  bg-[rgba(255,255,255,0.05)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.30)] border border-[rgba(255,255,255,0.12)]">
            total events 
                <!-- substats -->
                <div class="flex flex-row p-5">
                    <div class=" w-3/5 h-10 bg-[rgba(255,255,255,0.06)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] rounded-4xl">
                        <!-- <span class=" w-5 h-5 bg-gray-100 border rounded-full">circle</span> -->
                         <p class="text-center align-middle">+4 this week</p>
                    </div>
                    <div>

                    </div>
                </div>
            </div>

            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.05)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.30)] border border-[rgba(255,255,255,0.12)]">
                upcoming events
                <!-- substats -->
                <div>
                    
                </div>
            </div>
            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.05)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.30)] border border-[rgba(255,255,255,0.12)]">
                issued cert
                <!-- substats -->
                <div>
                    
                </div>
            </div>
            <div class="relative w-55 h-60 rounded-xl font-white sm:rounded-4xl bg-[rgba(255,255,255,0.05)] shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.30)] border border-[rgba(255,255,255,0.12)]">
                response rate
                <!-- substats -->
                <div>
                    
                </div>
            </div>
            <!-- what the hell is happening -->
        </div>
    </div>
    </section>
</template>

