<template>
<!-- Survey Builder Layout Container -->
<div class="w-full max-w-[1720px] mx-auto bg-[#23322e] rounded-[32px] p-12 text-white font-['Poppins'] select-none">
  
  <!-- Header Area -->
  <div class="flex justify-between items-start mb-10">
    <div>
      <h1 class="text-[44px] font-bold tracking-tight">Survey Builder</h1>
      <p class="text-lg text-gray-300 mt-1">Collect feedback from participants.</p>
    </div>
    <button class="flex items-center gap-2 border border-white/30 rounded-full px-6 py-3 text-base font-medium hover:bg-white/10 transition cursor-pointer">
      Create Event
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
      </svg>
    </button>
  </div>

  <!-- Questions Collection Frame -->
  <div class="flex flex-col gap-5 mb-8">
    
    <!-- Row Type A: Text Input Element Container -->
    <div class="flex items-start bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] transition group">
      <!-- Reorder Draggable Handle Matrix -->
      <div class="grid grid-cols-2 gap-0.5 text-gray-500 group-hover:text-gray-300 mr-5 mt-1.5 cursor-grab">
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
      </div>
      <!-- Core Meta Configuration Content -->
      <div class="flex-1">
        <span class="inline-block bg-[#0e3a2f] text-[#4ade80] text-xs font-semibold px-2.5 py-1 rounded-md mb-2">Question 1</span>
        <h3 class="text-xl font-medium mb-3">What is your full name?</h3>
        <div class="w-full border border-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm bg-transparent">Participant's answer...</div>
      </div>
    </div>

    <!-- Row Type B: Multiple Choice Layout (Question 4 Example) -->
    <div class="flex items-start bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] transition group">
      <div class="grid grid-cols-2 gap-0.5 text-gray-500 group-hover:text-gray-300 mr-5 mt-1.5 cursor-grab">
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
      </div>
      <div class="flex-1">
        <span class="inline-block bg-[#0e3a2f] text-[#4ade80] text-xs font-semibold px-2.5 py-1 rounded-md mb-2">Question 4</span>
        <h3 class="text-xl font-medium mb-4">What is your age?</h3>
        <!-- Horizontal Multi-Select Choice Options Stack -->
        <div class="flex flex-wrap gap-2.5">
          <button class="border border-white/20 hover:border-white/50 bg-white/5 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer">18 - 24</button>
          <button class="border border-white/20 hover:border-white/50 bg-white/5 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer">25 - 34</button>
          <button class="border border-white/20 hover:border-white/50 bg-white/5 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer">35 - 44</button>
          <button class="border border-white/20 hover:border-white/50 bg-white/5 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer">45 - 54</button>
          <button class="border border-white/20 hover:border-white/50 bg-white/5 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer">55 - 64</button>
          <button class="border border-white/20 hover:border-white/50 bg-white/5 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer">65+</button>
        </div>
      </div>
    </div>

    <!-- Row Type C: Star Rating Control Setup -->
    <div class="flex items-start bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] transition group">
      <div class="grid grid-cols-2 gap-0.5 text-gray-500 group-hover:text-gray-300 mr-5 mt-1.5 cursor-grab">
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
        <div class="w-1 h-1 bg-current rounded-full"></div><div class="w-1 h-1 bg-current rounded-full"></div>
      </div>
      <div class="flex-1">
        <span class="inline-block bg-[#0e3a2f] text-[#4ade80] text-xs font-semibold px-2.5 py-1 rounded-md mb-2">Question 5</span>
        <h3 class="text-xl font-medium mb-4">How would you rate this event overall?</h3>
        <!-- Rating Row Vectors -->
        <div class="flex gap-2">
          <!-- Multi-Instance Star Generator Wrapper Loops -->
          <button class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-yellow-400 transition cursor-pointer">
            <svg class="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.582 1.847l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.778-.595-.38-1.847.582-1.847h4.907a1 1 0 00.95-.69l1.519-4.674z"/></svg>
          </button>
          <!-- (Repeat for other 4 stars) -->
        </div>
      </div>
    </div>

  </div>

  <!-- Bottom Workspace Controls (Creation Insertion Tools) -->
  <div class="flex items-center gap-3 border-t border-white/10 pt-6">
    <button class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
      Rating Scale
    </button>
    <button class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
      Multiple Choice
    </button>
    <button class="flex items-center gap-1.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
      Text Answer
    </button>
  </div>

</div>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style scoped>

</style>