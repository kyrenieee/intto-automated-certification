<template>
<!-- Main Step Workspace Container -->
<div class="w-full max-w-[1720px] mx-auto bg-[#23322e] rounded-[32px] p-12 text-white font-['Poppins']">
  <div class="grid grid-cols-12 gap-10 items-start">
    
    <!-- LEFT PANEL: Configuration -->
    <div class="col-span-5 flex flex-col min-h-[560px] justify-between">
      <div>
        <h1 class="text-[52px] font-bold leading-tight tracking-tight mb-2">Certificate Preview</h1>
        <p class="text-[20px] font-normal text-gray-300/90 leading-relaxed mb-10">Define mapping configuration.</p>

        <!-- Variable Card -->
        <div class="group flex items-center bg-white/5 border border-white/15 rounded-2xl p-5 hover:bg-white/10 hover:border-white/30 transition-all cursor-grab">
          <div class="grid grid-cols-2 gap-1 text-gray-400 group-hover:text-white mr-5">
            <div class="w-1.5 h-1.5 bg-current rounded-full"></div><!-- ... -->
          </div>
          <div>
            <span class="text-xl font-medium text-white">Participant Name</span>
            <span class="text-sm text-gray-400 block">name • Required</span>
          </div>
        </div>
      </div>
      <button class="border border-white/20 rounded-full px-8 py-4 text-[19px] hover:bg-white/10">Continue</button>
    </div>

    <!-- RIGHT PANEL: Canvas -->
    <div class="col-span-7 pl-6">
      <div class="w-full aspect-[16/10] bg-white rounded-2xl shadow-2xl relative overflow-hidden text-black p-8">
        <!-- Content placeholders, accents, and text -->
        <div class="absolute top-0 right-0 w-36 h-36 bg-[#008080]/20 rounded-bl-full"></div>
        <div class="text-center my-auto flex flex-col items-center">
            <h2 class="text-3xl font-extrabold uppercase text-[#0c4a43]">Certificate</h2>
            <div class="border-b-2 border-dashed border-[#008080] p-2 mt-10">
                <span class="text-2xl font-semibold">Participant Name</span>
            </div>
        </div>
      </div>
    </div>
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