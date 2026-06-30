<template>
<!-- Main Wrapper (Frame 31) -->
<div class="absolute w-[1709px] h-[622px] left-[calc(50%-1709px/2-9.5px)] top-[333px] bg-white/10 rounded-[32px] p-[30px] font-['Poppins'] select-none">
  
  <!-- Header Control Area -->
  <div class="flex justify-between items-start pl-[110px] pr-[110px]">
    <div>
      <!-- Main Heading (Certificate Template) -->
      <h1 class="w-[831px] h-[96px] font-semibold text-[64px] leading-[96px] tracking-[0.005em] text-white">
        Certificate Template
      </h1>
      <!-- Subtitle Description -->
      <p class="w-[934px] h-[36px] font-normal text-[24px] leading-[36px] tracking-[0.005em] text-[#d3d3d3] mt-2">
        Upload your certificate template design. PNG, JPG, and PDF are supported
      </p>
    </div>

    <!-- Top Right Action Button -->
    <button class="flex items-center gap-2 border border-white/40 text-white rounded-full px-6 py-3 text-lg font-medium bg-transparent hover:bg-white/10 transition-colors duration-200 cursor-pointer">
      Continue to Next Step
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
      </svg>
    </button>
  </div>

  <!-- Interactive Dropzone (Container Area) -->
  <label class="box-border absolute w-[1168px] h-[381px] left-[145px] top-[189px] border-2 border-dashed border-[#d1d5dc] rounded-[14px] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all duration-200 group">
    <!-- Hidden File input -->
    <input type="file" accept=".png,.jpg,.jpeg,.pdf" class="hidden" />
    
    <!-- Central Upload Vector Layout -->
    <div class="flex flex-col items-center text-center">
      <!-- Upload Cloud Arrow Icon -->
      <svg class="w-12 h-12 text-[#d1d5dc] mb-3 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
      </svg>
      
      <!-- Label Prompt Description -->
      <span class="text-[#d1d5dc] text-lg font-medium mb-4 group-hover:text-white transition-colors duration-200">
        Upload your certificate template
      </span>
      
      <!-- Styled Core Interactive Trigger Element -->
      <div class="bg-[#3b82f6] hover:bg-blue-600 active:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-md transition-colors duration-150">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
        </svg>
        Choose File
      </div>
      
      <!-- Upload Constraints Subtext -->
      <div class="text-xs text-gray-400 mt-4 leading-relaxed">
        <p>Supports: JPG, JPEG, PNG</p>
        <p class="text-[11px] opacity-75">File size limit: 15MB</p>
      </div>
    </div>
  </label>

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