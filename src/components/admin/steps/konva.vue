<script setup>
import { ref, onMounted, onBeforeUnmount, watch, markRaw, nextTick } from "vue";
import Konva from "konva";

// props: templateUrl (string), variableMap (object), fieldValues (object)
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
  templateImg = null,
  resizeObserver = null;
const textNodes = new Map();

// standard function declaration ensures hoisting
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

// fit an image to a box while preserving aspect ratio, cropping as needed
const fitCover = (imgW, imgH, boxW, boxH) => {
  const imgRatio = imgW / imgH,
    boxRatio = boxW / boxH;
  let width, height;
  if (imgRatio > boxRatio) {
    height = boxH;
    width = boxH * imgRatio;
  } else {
    width = boxW;
    height = boxW / imgRatio;
  }
  return { width, height, x: (boxW - width) / 2, y: (boxH - height) / 2 };
};

const getStageSize = () => ({
  width: containerEl.value?.clientWidth || 600,
  height: containerEl.value?.clientHeight || 375,
});

const positionBackground = () => {
  if (!stage || !bgImageNode || !templateImg) return;
  const { width: stageW, height: stageH } = getStageSize();
  const fit = fitCover(
    templateImg.naturalWidth,
    templateImg.naturalHeight,
    stageW,
    stageH,
  );
  bgImageNode.setAttrs(fit);
};

const positionNode = (key, node) => {
  const entry = props.variableMap[key];
  if (!entry || !stage) return;
  const { width: stageW, height: stageH } = getStageSize();
  node.x(entry.xRatio * stageW);
  node.y(entry.yRatio * stageH);
  node.fontSize(entry.fontSize || 28);
};

const createTextNode = (key) => {
  const entry = props.variableMap[key];
  const node = markRaw(
    new Konva.Text({
      text: props.fieldValues[key] ?? key,
      fontFamily: "Poppins, sans-serif",
      fontSize: entry.fontSize || 28,
      fill: entry.fill || "#0c4a43",
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
    layer.batchDraw();
  });

  node.on("dragend", () => {
    const { width: stageW, height: stageH } = getStageSize();
    entry.xRatio = node.x() / stageW;
    entry.yRatio = node.y() / stageH;
  });

  layer.add(node);
  positionNode(key, node);
  textNodes.set(key, node);
};

const destroyTextNode = (key) => {
  const node = textNodes.get(key);
  if (node) {
    node.destroy();
    textNodes.delete(key);
  }
};

//load the template uploaded and add it to the layer
const loadTemplateImage = (url) => {
  if (!url || !layer) return;
  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    templateImg = img;
    if (bgImageNode) bgImageNode.destroy();
    bgImageNode = markRaw(new Konva.Image({ image: img }));
    layer.add(bgImageNode);
    bgImageNode.moveToBottom();
    positionBackground();
    layer.batchDraw();
  };
  img.src = url;
};
// initialize the Konva stage and layer, and add the background rectangle and template image
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

// watch for changes in templateUrl, variableMap, and fieldValues to update the stage accordingly
onMounted(async () => {
  await nextTick();
  if (!containerEl.value) return;
  initStage();

  resizeObserver = new ResizeObserver(() => {
    const size = getStageSize();
    stage.width(size.width);
    stage.height(size.height);
    positionBackground();
    for (const [key, node] of textNodes.entries()) positionNode(key, node);
    layer.batchDraw();
  });
  resizeObserver.observe(containerEl.value);
});

// cleanup on unmount
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  stage?.destroy();
});

watch(
  () => props.templateUrl,
  (url) => loadTemplateImage(url),
);
watch(
  () => Object.keys(props.variableMap).join(","),
  () => syncNodesToVariableMap(),
);
watch(
  () => props.fieldValues,
  (vals) => {
    for (const [key, node] of textNodes.entries()) node.text(vals[key] ?? key);
    layer?.batchDraw();
  },
  { deep: true },
);
</script>

<template>
  <div ref="containerEl" class="w-full h-full cursor-crosshair"></div>
</template>
