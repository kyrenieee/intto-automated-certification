export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
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

function drawFields(ctx, canvas, variableMap, fieldValues, fallbackFont) {
  for (const [key, entry] of Object.entries(variableMap)) {
    const text = fieldValues[key]
    if (text == null || text === '') continue

    // use editor container dimensions saved in the placement, or default to standard workspace ratio
    const editorW = entry.editorWidth || 800
    const editorH = entry.editorHeight || 500 // standard 16:10 aspect ratio baseline
    
    const scaleX = canvas.width / editorW
    const scaleY = canvas.height / editorH

    // calculate exact coordinates relative to the natural image size
    const x = (entry.x !== undefined ? entry.x : (entry.xRatio * editorW)) * scaleX
    const y = (entry.y !== undefined ? entry.y : (entry.yRatio * editorH)) * scaleY
    
    // scale font size proportionally to the image height resolution
    const fontSize = (entry.fontSize || 28) * scaleY

    const fontFamily = entry.fontFamily ? `${entry.fontFamily}, sans-serif` : `${fallbackFont}, sans-serif`

    ctx.save()
    ctx.font = `bold ${fontSize}px ${fontFamily}`
    ctx.fillStyle = entry.fill || '#000000'
    
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    ctx.fillText(text, x, y)
    ctx.restore()
  }
}

export async function generateCertificate(templateUrl, variableMap, fieldValues, options = {}) {
  const { fontFamily = 'Poppins', mimeType = 'image/jpeg', quality = 0.92 } = options

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

export async function generateCertificatesForParticipants(
  templateUrl,
  variableMap,
  sharedFieldValues,
  participants,
  options = {}
) {
  const { fontFamily = 'Poppins', mimeType = 'image/jpeg', quality = 0.92 } = options

  await ensureFontLoaded(fontFamily)
  const img = await loadImage(templateUrl)

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