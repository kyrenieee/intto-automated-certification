

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
import.meta.env.VITE_CLOUDINARY_API_KEY

/**
 * upload a file to cloudinary
 * @param {File} file
 * @param {Object} [options]
 * @param {(percent: number) => void} [options.onProgress] - 0-100
 * @param {string} [options.folder]
 * @returns {Promise<{ secureUrl: string, publicId: string, width: number, height: number, resourceType: string, raw: any }>}
 */
export function uploadToCloudinary(file, { onProgress, folder } = {}) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return Promise.reject(
      new Error(
        'Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
      )
    )
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    if (folder) formData.append('folder', folder)

    const xhr = new XMLHttpRequest()
    // 'auto' lets Cloudinary detect image vs raw vs video - handles PNG/JPG/PDF fine
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      let data
      try {
        data = JSON.parse(xhr.responseText)
      } catch (err) {
        reject(new Error('Unexpected response from Cloudinary.'))
        return
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          secureUrl: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          resourceType: data.resource_type,
          raw: data,
        })
      } else {
        reject(new Error(data?.error?.message || `Upload failed (${xhr.status})`))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload.'))

    xhr.send(formData)
  })
}