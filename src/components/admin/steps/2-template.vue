<template>
  <main
    class="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-4xl p-6 sm:p-10 font-poppins select-none flex flex-col gap-y-8"
  >
    <!-- header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Certificate Template
        </h1>
        <p class="text-sm sm:text-base font-normal text-[#d3d3d3] mt-2">
          Upload your certificate template design. PNG, JPG, and PDF are supported.
        </p>
      </div>

      <button
        @click="handleNext"
        :disabled="!canContinue"
        class="flex items-center gap-2 border border-white/40 text-white rounded-full px-6 py-3 text-sm font-medium bg-transparent hover:bg-white/10 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {{ isUploading ? 'Uploading…' : 'Continue to Next Step' }}
        <svg v-if="!isUploading" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
        </svg>
        <span
          v-else
          class="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        ></span>
      </button>
    </div>

    <!-- template upload -->
    <label
      class="w-full h-80 sm:h-95.25 border-2 border-dashed border-[#d1d5dc] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all duration-200 group"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        class="hidden"
        @change="handleFileChange"
      />

      <div v-if="!eventForm.templateFile" class="flex flex-col items-center text-center px-6">
        <svg class="w-12 h-12 text-[#d1d5dc] mb-3 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
        </svg>

        <span class="text-[#d1d5dc] text-lg font-medium mb-4 group-hover:text-white transition-colors duration-200">
          Upload your certificate template
        </span>

        <div class="bg-[#3b82f6] hover:bg-blue-600 active:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-md transition-colors duration-150">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
          </svg>
          Choose File
        </div>

        <div class="text-xs text-gray-400 mt-4 leading-relaxed">
          <p>Supports: JPG, JPEG, PNG, PDF</p>
          <p class="text-[11px] opacity-75">File size limit: 15MB</p>
        </div>
      </div>

      <!-- Selected file preview -->
      <div v-else class="flex flex-col items-center text-center px-6 w-full" @click.prevent>
        <img
          v-if="previewUrl"
          :src="previewUrl"
          alt="Template preview"
          class="max-h-55 rounded-lg shadow-lg mb-4 object-contain"
        />
        <p class="text-white font-medium">{{ eventForm.templateFile.name }}</p>

        <!-- Upload progress -->
        <div v-if="isUploading" class="w-full max-w-xs mt-3">
          <div class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#3b82f6] transition-all duration-150"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-400 mt-1.5">Uploading… {{ uploadProgress }}%</p>
        </div>

        <!-- Concrete confirmation the file actually made it to Cloudinary -->
        <div v-else-if="eventForm.templateUrl" class="mt-2 flex flex-col items-center gap-1">
          <p class="text-xs text-emerald-300">✓ Uploaded to Cloudinary</p>
          <a
            :href="eventForm.templateUrl"
            target="_blank"
            rel="noopener"
            class="text-xs text-blue-300 hover:text-blue-200 underline"
          >
            View uploaded file ↗
          </a>
        </div>

        <p v-if="uploadError" class="text-xs text-red-300 mt-2">
          {{ uploadError }}
          <button type="button" @click.stop.prevent="retryUpload" class="underline ml-1">Retry</button>
        </p>

        <button
          type="button"
          @click.stop.prevent="clearFile"
          class="mt-3 text-xs text-red-300 hover:text-red-200 underline"
        >
          Remove file
        </button>
      </div>
    </label>

    <div class="flex justify-start">
      <button
        @click="$emit('back')"
        class="text-xs font-medium text-white/50 hover:text-white transition-colors duration-200"
      >
        ← Back
      </button>
    </div>
  </main>
</template>

<script>
import { ref, computed, onBeforeUnmount } from 'vue'
import { uploadToCloudinary } from '../../../utils/cloudinary'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB

export default {
  name: 'Step2Template',
  props: {
    eventForm: {
      type: Object,
      required: true,
    },
  },
  emits: ['next', 'back'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const previewUrl = ref(null)
    const isUploading = ref(false)
    const uploadProgress = ref(0)
    const uploadError = ref('')

    const runUpload = async (file) => {
      isUploading.value = true
      uploadProgress.value = 0
      uploadError.value = ''

      try {
        const result = await uploadToCloudinary(file, {
          folder: 'certificate-templates',
          onProgress: (pct) => {
            uploadProgress.value = pct
          },
        })
        props.eventForm.templateUrl = result.secureUrl
        props.eventForm.templatePublicId = result.publicId

        // the POST to api.cloudinary.com, or open this URL directly.
        console.log('[Cloudinary] template uploaded:', result.secureUrl)
      } catch (err) {
        uploadError.value = err.message || 'Upload failed. Please try again.'
        props.eventForm.templateUrl = null
        props.eventForm.templatePublicId = null
        console.error('[Cloudinary] upload failed:', err)
      } finally {
        isUploading.value = false
      }
    }

    const setFile = (file) => {
      if (!file) return
      if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Max size is 15MB.')
        return
      }

      props.eventForm.templateFile = file
      props.eventForm.templateUrl = null
      props.eventForm.templatePublicId = null

      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = file.type.startsWith('image/') ? URL.createObjectURL(file) : null

    
      runUpload(file)
    }

    const retryUpload = () => {
      if (props.eventForm.templateFile) runUpload(props.eventForm.templateFile)
    }

    const handleFileChange = (e) => {
      setFile(e.target.files?.[0])
    }

    const handleDrop = (e) => {
      setFile(e.dataTransfer.files?.[0])
    }

    const clearFile = () => {
      props.eventForm.templateFile = null
      props.eventForm.templateUrl = null
      props.eventForm.templatePublicId = null
      uploadError.value = ''
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
      if (fileInput.value) fileInput.value.value = ''
    }

    onBeforeUnmount(() => {
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    })

    const canContinue = computed(
      () =>
        Boolean(props.eventForm.templateFile) &&
        Boolean(props.eventForm.templateUrl) &&
        !isUploading.value
    )

    const handleNext = () => {
      if (!canContinue.value) return
      emit('next')
    }

    return {
      eventForm: props.eventForm,
      fileInput,
      previewUrl,
      isUploading,
      uploadProgress,
      uploadError,
      canContinue,
      handleFileChange,
      handleDrop,
      clearFile,
      retryUpload,
      handleNext,
    }
  },
}
</script>

<style scoped>
</style>