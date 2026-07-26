<script setup>
import { ref, onMounted, onBeforeUnmount, watch, markRaw, nextTick } from "vue";
import Konva from "konva";

const props = defineProps({
  templateUrl: { type: String, default: null },
  variableMap: { type: Object, required: true },
  fieldValues: { type: Object, default: () => ({}) },
});

const containerEl = ref(null);
let stage = null,
  layer = null,
  bgRect = null,
  bgImageNode = null,
  resizeObserver = null;
const textNodes = new Map();

function syncNodesToVariableMap() {
  if (!layer) return;
  const currentKeys = Object.keys(props.variableMap);

  for (const key of textNodes.keys()) {
    if (!currentKeys.includes(key)) destroyTextNode(key);
  }
  for (const key of currentKeys) {
    if (!textNodes.has(key)) createTextNode(key);
  }
  for (const node of textNodes.values()) node.moveToTop();
  layer.batchDraw();
}


const centerTextOrigin = (node) => {
  node.offsetX(node.width() / 2);
  node.offsetY(node.height() / 2);
};

const getStageSize = () => ({
  width: containerEl.value?.clientWidth || 600,
  height: containerEl.value?.clientHeight || 375,
});


const positionBackground = () => {
  if (!stage || !bgImageNode) return;
  const { width: stageW, height: stageH } = getStageSize();
  bgImageNode.setAttrs({ x: 0, y: 0, width: stageW, height: stageH });
};

const positionNode = (key, node) => {
  const entry = props.variableMap[key];
  if (!entry || !stage) return;
  const { width: stageW, height: stageH } = getStageSize();
  node.x(entry.xRatio * stageW);
  node.y(entry.yRatio * stageH);
  node.fontSize(entry.fontSize || 28);
  node.fill(entry.fill || '#000000');
  node.fontFamily(entry.fontFamily ? `${entry.fontFamily}, sans-serif` : 'Poppins, sans-serif');
};

const createTextNode = (key) => {
  const entry = props.variableMap[key];
  const node = markRaw(
    new Konva.Text({
      text: props.fieldValues[key] ?? key,
      fontFamily: entry.fontFamily ? `${entry.fontFamily}, sans-serif` : "Poppins, sans-serif",
      fontSize: entry.fontSize || 28,
      fontStyle: "bold",
      fill: entry.fill || "#000000",
      draggable: true,
    }),
  );

  node.on("wheel", (e) => {
    e.evt.preventDefault();
    let fontSize = node.fontSize();
    const delta = e.evt.deltaY > 0 ? -2 : 2;
    fontSize = Math.max(10, Math.min(100, fontSize + delta));
    node.fontSize(fontSize);
    entry.fontSize = fontSize;
    const { width: stageW, height: stageH } = getStageSize();
    entry.editorWidth = stageW;
    entry.editorHeight = stageH;
    centerTextOrigin(node);
    layer.batchDraw();
  });

  node.on("dragend", () => {
    const { width: stageW, height: stageH } = getStageSize();
    entry.xRatio = node.x() / stageW;
    entry.yRatio = node.y() / stageH;
    entry.editorWidth = stageW;
    entry.editorHeight = stageH;
  });

  layer.add(node);
  positionNode(key, node);
  centerTextOrigin(node);
  const { width: stageW, height: stageH } = getStageSize();
  entry.editorWidth = stageW;
  entry.editorHeight = stageH;
  textNodes.set(key, node);
};

const destroyTextNode = (key) => {
  const node = textNodes.get(key);
  if (node) {
    node.destroy();
    textNodes.delete(key);
  }
};

const loadTemplateImage = (url) => {
  if (!url || !layer) return;
  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    if (bgImageNode) bgImageNode.destroy();
    bgImageNode = markRaw(new Konva.Image({ image: img }));
    layer.add(bgImageNode);
    bgImageNode.moveToBottom();
    positionBackground();
    layer.batchDraw();
  };
  img.onerror = () => {
    console.error('[CertificateCanvas] Failed to load template image (404 / Network error):', url);
  };
  img.src = url;
};

const initStage = () => {
  const { width, height } = getStageSize();
  stage = markRaw(
    new Konva.Stage({
      container: containerEl.value,
      width,
      height,
    }),
  );
  layer = markRaw(new Konva.Layer());
  stage.add(layer);

  bgRect = markRaw(new Konva.Rect({ x: 0, y: 0, fill: "#ffffff" }));
  layer.add(bgRect);

  loadTemplateImage(props.templateUrl);
  syncNodesToVariableMap();
};

onMounted(async () => {
  await nextTick();
  if (!containerEl.value) return;
  initStage();

  resizeObserver = new ResizeObserver(() => {
    const size = getStageSize();
    if (!stage) return;
    stage.width(size.width);
    stage.height(size.height);
    positionBackground();
    for (const [key, node] of textNodes.entries()) positionNode(key, node);
    layer.batchDraw();
  });
  resizeObserver.observe(containerEl.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  stage?.destroy();
});

watch(() => props.templateUrl, (url) => loadTemplateImage(url));
watch(() => Object.keys(props.variableMap).join(","), () => syncNodesToVariableMap());

// Watch changes deeply on variableMap to update colors, font families, or sizes in real-time
watch(
  () => props.variableMap,
  (newMap) => {
    for (const [key, node] of textNodes.entries()) {
      const entry = newMap[key];
      if (entry) {
        if (entry.fill) node.fill(entry.fill);
        if (entry.fontFamily) node.fontFamily(`${entry.fontFamily}, sans-serif`);
        if (entry.fontSize) node.fontSize(entry.fontSize);
        centerTextOrigin(node);
      }
    }
    layer?.batchDraw();
  },
  { deep: true }
);

watch(
  () => props.fieldValues,
  (vals) => {
    for (const [key, node] of textNodes.entries()) {
      node.text(vals[key] ?? key);
      centerTextOrigin(node);
    }
    layer?.batchDraw();
  },
  { deep: true },
);
</script>

<template>
  <div ref="containerEl" class="w-full h-full cursor-crosshair"></div>
</template>