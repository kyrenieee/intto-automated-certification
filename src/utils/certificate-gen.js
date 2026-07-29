import inttoLogo from '../assets/inttologo.svg'

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

// helper to draw border radius
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// helper to load and draw the QR code layout onto the final canvas
async function drawQrCode(ctx, canvas, entry, qrTextUrl) {
  if (!qrTextUrl) return

  // generate raw QR code using High Error Correction (ecc=H) to support center logo placement
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&data=${encodeURIComponent(qrTextUrl)}`

  // load both the QR code and the central logo concurrently
  const [qrImg, logoImg] = await Promise.all([
    loadImage(qrApiUrl).catch((err) => {
      console.warn('[certificateGenerator] Failed to load QR code image:', err)
      return null
    }),
    loadImage(inttoLogo).catch((err) => {
      console.warn('[certificateGenerator] Failed to load center logo:', err)
      return null
    })
  ])

  if (!qrImg) return

  const editorW = entry.editorWidth || 800
  const editorH = entry.editorHeight || 500
  const scaleX = canvas.width / editorW
  const scaleY = canvas.height / editorH

  const centerX = (entry.x !== undefined ? entry.x : (entry.xRatio * editorW)) * scaleX
  const centerY = (entry.y !== undefined ? entry.y : (entry.yRatio * editorH)) * scaleY
  const size = (entry.size || 100) * scaleX

  const startX = centerX - size / 2
  const startY = centerY - size / 2

  ctx.save()

  // outline
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
  ctx.shadowBlur = 12 * scaleX
  ctx.shadowOffsetY = 4 * scaleX
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#e4e4e7'
  ctx.lineWidth = 2 * scaleX
  
  const cornerRadius = size * 0.12
  drawRoundedRect(ctx, startX, startY, size, size, cornerRadius)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // qr code
  const padding = size * 0.06
  const qrSize = size - (padding * 2)
  ctx.drawImage(qrImg, startX + padding, startY + padding, qrSize, qrSize)

  // circle outline for the logo
  const badgeSize = size * 0.28
  const badgeRadius = badgeSize / 2
  
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = 6 * scaleX
  ctx.beginPath()
  ctx.arc(centerX, centerY, badgeRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#18181b'
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3 * scaleX
  ctx.stroke()
  ctx.restore()

  // intto logo
  if (logoImg) {
    const maxLogoBox = badgeSize * 0.6
    const imgAspect = logoImg.naturalWidth / logoImg.naturalHeight
    let logoW = maxLogoBox
    let logoH = maxLogoBox
    if (imgAspect > 1) {
      logoH = maxLogoBox / imgAspect
    } else {
      logoW = maxLogoBox * imgAspect
    }

    ctx.drawImage(
      logoImg,
      centerX - logoW / 2,
      centerY - logoH / 2,
      logoW,
      logoH
    )
  }

  ctx.restore()
}

async function drawFields(ctx, canvas, variableMap, fieldValues, fallbackFont) {
  for (const [key, entry] of Object.entries(variableMap)) {
    const text = fieldValues[key]
    if (text == null || text === '') continue

    // handle QR Code drawing separately
    if (key === 'qr_code') {
      await drawQrCode(ctx, canvas, entry, text)
      continue
    }

    const editorW = entry.editorWidth || 800
    const editorH = entry.editorHeight || 500
    
    const scaleX = canvas.width / editorW
    const scaleY = canvas.height / editorH

    const x = (entry.x !== undefined ? entry.x : (entry.xRatio * editorW)) * scaleX
    const y = (entry.y !== undefined ? entry.y : (entry.yRatio * editorH)) * scaleY
    
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

  await drawFields(ctx, canvas, variableMap, fieldValues, fontFamily)

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

    const fieldValues = { 
      ...sharedFieldValues, 
      name: participant.name, 
      ...participant 
    }
    
    await drawFields(ctx, canvas, variableMap, fieldValues, fontFamily)

    results.push({
      name: participant.name,
      dataUrl: canvas.toDataURL(mimeType, quality),
    })
  }

  return results
}