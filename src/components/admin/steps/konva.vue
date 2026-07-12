<script setup>
import { ref, onMounted, onBeforeUnmount, watch, markRaw, nextTick } from 'vue'
import Konva from 'konva'

const props = defineProps({
  templateUrl: {
    type: String,
    default: null,
  },
  
  variableMap: {
    type: Object,
    required: true,
  },
  // key -> display string, e.g. { name: '{{ Participant Name }}', event_name: 'Technodemo Day 7' }
  fieldValues: {
    type: Object,
    default: () => ({}),
  },
})

const containerEl = ref(null)

let stage = null
let layer = null
let bgRect = null
let bgImageNode = null
let templateImg = null
let resizeObserver = null

// key -> Konva.Text node, kept outside Vue's reactivity so Konva instances never get proxied
const textNodes = new Map()

const displayText = (key) => props.fieldValues[key] ?? key

const fitCover = (imgW, imgH, boxW, boxH) => {
  const imgRatio = imgW / imgH
  const boxRatio = boxW / boxH
  let width, height
  if (imgRatio > boxRatio) {
    height = boxH
    width = boxH * imgRatio
  } else {
    width = boxW
    height = boxW / imgRatio
  }
  return { width, height, x: (boxW - width) / 2, y: (boxH - height) / 2 }
}

const getStageSize = () => {
  const el = containerEl.value
  return { width: el?.clientWidth || 600, height: el?.clientHeight || 375 }
}

const positionBackground = () => {
  if (!stage) return
  const { width: stageW, height: stageH } = getStageSize()

  bgRect.width(stageW)
  bgRect.height(stageH)

  if (bgImageNode && templateImg) {
    const fit = fitCover(templateImg.naturalWidth, templateImg.naturalHeight, stageW, stageH)
    bgImageNode.setAttrs(fit)
  }
}

const positionNode = (key, node) => {
  const entry = props.variableMap[key]
  if (!entry || !stage) return
  const { width: stageW, height: stageH } = getStageSize()
  node.x(entry.xRatio * stageW)
  node.y(entry.yRatio * stageH)
  node.fontSize(entry.fontSize || 28)
}

const createTextNode = (key) => {
  const entry = props.variableMap[key]
  const node = markRaw(
    new Konva.Text({
      text: displayText(key),
      fontFamily: 'Poppins, sans-serif',
      fontStyle: '600',
      fontSize: entry.fontSize || 28,
      fill: entry.fill || '#0c4a43',
      draggable: true,
    })
  )

  node.on('dragmove', () => {
    const { width: stageW, height: stageH } = getStageSize()
    // clamp inside the canvas
    const x = Math.min(Math.max(node.x(), 0), stageW)
    const y = Math.min(Math.max(node.y(), 0), stageH)
    node.x(x)
    node.y(y)
  })

  node.on('dragend', () => {
    const { width: stageW, height: stageH } = getStageSize()
    entry.xRatio = node.x() / stageW
    entry.yRatio = node.y() / stageH
  })

  layer.add(node)
  positionNode(key, node)
  textNodes.set(key, node)
}

const destroyTextNode = (key) => {
  const node = textNodes.get(key)
  if (node) {
    node.destroy()
    textNodes.delete(key)
  }
}

const syncNodesToVariableMap = () => {
  if (!layer) return
  const currentKeys = Object.keys(props.variableMap)

  // remove nodes for keys no longer present
  for (const key of textNodes.keys()) {
    if (!currentKeys.includes(key)) destroyTextNode(key)
  }
  // add nodes for new keys
  for (const key of currentKeys) {
    if (!textNodes.has(key)) createTextNode(key)
  }
  // keep placed nodes above the background image
  for (const node of textNodes.values()) node.moveToTop()
  layer.batchDraw()
}

const loadTemplateImage = (url) => {
  if (!stage) return

  if (!url) {
    if (bgImageNode) {
      bgImageNode.destroy()
      bgImageNode = null
      templateImg = null
      layer?.batchDraw()
    }
    return
  }

  const img = new window.Image()
  img.crossOrigin = 'anonymous'

  img.onload = () => {
    templateImg = img

    if (bgImageNode) bgImageNode.destroy()
    bgImageNode = markRaw(new Konva.Image({ image: img }))
    layer.add(bgImageNode)
    bgImageNode.moveToBottom()
    positionBackground()

    for (const node of textNodes.values()) node.moveToTop()
    layer.batchDraw()
  }

  img.onerror = () => {
    console.error('[CertificateCanvas] Failed to load template image:', url)
  }

  img.src = url
}

const initStage = () => {
  const { width, height } = getStageSize()

  stage = markRaw(
    new Konva.Stage({
      container: containerEl.value,
      width,
      height,
    })
  )

  layer = markRaw(new Konva.Layer())
  stage.add(layer)

  bgRect = markRaw(new Konva.Rect({ x: 0, y: 0, fill: '#ffffff' }))
  layer.add(bgRect)
  positionBackground()

  loadTemplateImage(props.templateUrl)
  syncNodesToVariableMap()

  resizeObserver = new ResizeObserver(() => {
    const size = getStageSize()
    stage.width(size.width)
    stage.height(size.height)
    positionBackground()
    for (const [key, node] of textNodes.entries()) positionNode(key, node)
    layer.batchDraw()
  })
  resizeObserver.observe(containerEl.value)
}

onMounted(async () => {
  // guard against the container having zero size on the very first tick
  // (e.g. layout not settled yet) before Konva measures it
  await nextTick()
  if (!containerEl.value) return
  initStage()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  stage?.destroy()
})

watch(() => props.templateUrl, (url) => loadTemplateImage(url))

// keys added/removed (place/remove a field) -> create/destroy nodes
watch(
  () => Object.keys(props.variableMap).join(','),
  () => syncNodesToVariableMap()
)

// live text values changing (e.g. user edits Event Name back in Step 1)
watch(
  () => props.fieldValues,
  (vals) => {
    for (const [key, node] of textNodes.entries()) {
      node.text(vals[key] ?? key)
    }
    layer?.batchDraw()
  },
  { deep: true }
)
</script>

<template>
  <div ref="containerEl" class="w-full h-full"></div>
</template>