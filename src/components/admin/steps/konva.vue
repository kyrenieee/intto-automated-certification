<script setup>
import { ref, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
import Konva from 'konva'

const props = defineProps({
  templateUrl: {
    type: String,
    default: null,
  },
  // reactive object owned by the parent's eventForm, e.g.
  // { name: { xRatio, yRatio, text, fontSize, fill }, date: {...} }
  // mutated directly on drag - same reactive reference all the way up to EventCalDetails.vue.
  variableMap: {
    type: Object,
    required: true,
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
      text: entry.text || key,
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
  layer.batchDraw()
}

const loadTemplateImage = (url) => {
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
    // draw background image below the bg rect fallback but above nothing else
    layer.add(bgImageNode)
    bgImageNode.moveToBottom()
    positionBackground()

    // keep text nodes above the image
    for (const node of textNodes.values()) node.moveToTop()
    layer.batchDraw()
  }
  img.src = url
}

onMounted(() => {
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
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  stage?.destroy()
})

watch(() => props.templateUrl, (url) => loadTemplateImage(url))

// deep watch so adding/removing keys (from the parent's toggle) syncs nodes,
// and editing entry.text updates the node label in place
watch(
  () => props.variableMap,
  (map) => {
    syncNodesToVariableMap()
    for (const [key, node] of textNodes.entries()) {
      const entry = map[key]
      if (entry) node.text(entry.text || key)
    }
    layer?.batchDraw()
  },
  { deep: true }
)
</script>

<template>
  <div ref="containerEl" class="w-full h-full"></div>
</template>