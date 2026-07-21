export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous' // required so toDataURL()/toBlob() don't throw on a Cloudinary-hosted image
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load template image: ${url}`))
    img.src = url
  })
}

async function ensureFontLoaded(fontFamily, sampleSizePx = 100) {
  if (typeof document === 'undefined' || !document.fonts) return
  try {
    await document.fonts.load(`600 ${sampleSizePx}px ${fontFamily}`)
  } catch (err) {
    console.warn(`[certificateGenerator] Could not preload font "${fontFamily}":`, err)
  }
}

function drawFields(ctx, canvas, variableMap, fieldValues, fontFamily) {
  for (const [key, entry] of Object.entries(variableMap)) {
    const text = fieldValues[key]
    if (text == null || text === '') continue

    const fontSize = (entry.fontSizeRatio ?? 0.06) * canvas.height
    const x = entry.xRatio * canvas.width
    const y = entry.yRatio * canvas.height

    ctx.font = `${entry.fontWeight || '600'} ${fontSize}px ${fontFamily}`
    ctx.fillStyle = entry.fill || '#0c4a43'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y)
  }
}

/**
 * generate a single certificate.
 *
 * @param {string} templateUrl - Cloudinary-hosted template image (or any CORS-enabled URL)
 * @param {Object} variableMap - { key: { xRatio, yRatio, fontSizeRatio, fill } }, straight from eventForm.variableMap
 * @param {Object} fieldValues - { key: 'text to render' }, e.g. { name: 'Jane Doesnt', event_name: 'Technodemo Day 7', date: 'July 29, 2026' }
 * @param {Object} [options]
 * @param {string} [options.fontFamily='Poppins, sans-serif']
 * @param {'image/png'|'image/jpeg'} [options.mimeType='image/png']
 * @param {number} [options.quality=0.92] - only used for image/jpeg
 * @returns {Promise<string>} data URL of the rendered certificate
 */
export async function generateCertificate(templateUrl, variableMap, fieldValues, options = {}) {
  const { fontFamily = 'Poppins, sans-serif', mimeType = 'image/png', quality = 0.92 } = options

  await ensureFontLoaded(fontFamily)
  const img = await loadImage(templateUrl)

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  drawFields(ctx, canvas, variableMap, fieldValues, fontFamily)

  return canvas.toDataURL(mimeType, quality)
}

/**
 * bulk-generate certificates for a list of participants, reusing one loaded
 * template image across all of them instead of re-fetching it per person.
 *
 * @param {string} templateUrl
 * @param {Object} variableMap
 * @param {Object} sharedFieldValues - fields that are the same on every certificate (e.g. event_name, date)
 * @param {Array<{name: string, [key: string]: any}>} participants - each participant's own field values, e.g. { name: 'Jane Doe' }
 * @param {Object} [options] - same as generateCertificate
 * @returns {Promise<Array<{ name: string, dataUrl: string }>>}
 */
export async function generateCertificatesForParticipants(
  templateUrl,
  variableMap,
  sharedFieldValues,
  participants,
  options = {}
) {
  const { fontFamily = 'Poppins, sans-serif', mimeType = 'image/png', quality = 0.92 } = options

  await ensureFontLoaded(fontFamily)
  const img = await loadImage(templateUrl) // loaded once, reused for every participant

  const results = []

  for (const participant of participants) {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const fieldValues = { ...sharedFieldValues, name: participant.name, ...participant }
    drawFields(ctx, canvas, variableMap, fieldValues, fontFamily)

    results.push({
      name: participant.name,
      dataUrl: canvas.toDataURL(mimeType, quality),
    })
  }

  return results
}