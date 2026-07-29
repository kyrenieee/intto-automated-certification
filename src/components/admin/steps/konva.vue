<script setup>
import { ref, onMounted, onBeforeUnmount, watch, markRaw, nextTick } from "vue";
import Konva from "konva";
import inttoLogo from "@/assets/inttologo.svg";

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
const imageNodes = new Map();

function syncNodesToVariableMap() {
  if (!layer) return;
  const currentKeys = Object.keys(props.variableMap);

  for (const key of textNodes.keys()) {
    if (!currentKeys.includes(key)) destroyTextNode(key);
  }
  for (const key of imageNodes.keys()) {
    if (!currentKeys.includes(key)) destroyImageNode(key);
  }

  for (const key of currentKeys) {
    if (key === 'qr_code') {
      if (!imageNodes.has(key)) createQRCodeNode(key);
    } else {
      if (!textNodes.has(key)) createTextNode(key);
    }
  }

  for (const node of textNodes.values()) node.moveToTop();
  for (const node of imageNodes.values()) node.moveToTop();
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

  if (key === 'qr_code') {
    const size = entry.size || 100;
    node.width(size);
    node.height(size);
    node.offsetX(size / 2);
    node.offsetY(size / 2);
  } else {
    node.fontSize(entry.fontSize || 28);
    node.fill(entry.fill || '#000000');
    node.fontFamily(entry.fontFamily ? `${entry.fontFamily}, sans-serif` : 'Poppins, sans-serif');
  }
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

const createQRCodeNode = (key) => {
  const entry = props.variableMap[key];
  const targetUrl = props.fieldValues[key];
  if (!targetUrl) return;

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&data=${encodeURIComponent(targetUrl)}`;

  const qrImg = new window.Image();
  qrImg.crossOrigin = "anonymous";
  qrImg.onload = () => {
    const size = entry.size || 100;
    
    const group = markRaw(
      new Konva.Group({
        draggable: true,
        width: size,
        height: size,
        offsetX: size / 2,
        offsetY: size / 2,
      })
    );

    // border radius bg
    const outerCard = new Konva.Rect({
      width: size,
      height: size,
      fill: '#ffffff',
      stroke: '#e4e4e7',
      strokeWidth: 2,
      cornerRadius: size * 0.12,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowBlur: 10,
      shadowOffset: { x: 0, y: 4 },
      shadowOpacity: 0.6,
    });
    group.add(outerCard);

    // qr image nood
    const padding = size * 0.06;
    const qrImageNode = new Konva.Image({
      image: qrImg,
      x: padding,
      y: padding,
      width: size - (padding * 2),
      height: size - (padding * 2),
    });
    group.add(qrImageNode);

    // logo bg
    const badgeSize = size * 0.28;
    const badgeBg = new Konva.Circle({
      x: size / 2,
      y: size / 2,
      radius: badgeSize / 2,
      fill: '#18181b',
      stroke: '#ffffff',
      strokeWidth: 3,
      shadowColor: 'black',
      shadowBlur: 6,
      shadowOpacity: 0.3,
    });
    group.add(badgeBg);

    const logoImg = new window.Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.onload = () => {
      const maxLogoBox = badgeSize * 0.6;
      const imgAspect = logoImg.naturalWidth / logoImg.naturalHeight;
      let logoW = maxLogoBox;
      let logoH = maxLogoBox;
      if (imgAspect > 1) {
        logoH = maxLogoBox / imgAspect;
      } else {
        logoW = maxLogoBox * imgAspect;
      }

      const logoIcon = new Konva.Image({
        image: logoImg,
        width: logoW,
        height: logoH,
        x: size / 2,
        y: size / 2,
        offsetX: logoW / 2,
        offsetY: logoH / 2,
      });
      group.add(logoIcon);
      layer.batchDraw();
    };
    logoImg.src = inttoLogo;

    // mouse wheel scaling for the QR code
    group.on("wheel", (e) => {
      e.evt.preventDefault();
      let currentSize = entry.size || group.width();
      const delta = e.evt.deltaY > 0 ? -5 : 5;
      currentSize = Math.max(50, Math.min(300, currentSize + delta));
      
      entry.size = currentSize;
      group.width(currentSize);
      group.height(currentSize);
      group.offsetX(currentSize / 2);
      group.offsetY(currentSize / 2);

      outerCard.width(currentSize);
      outerCard.height(currentSize);
      outerCard.cornerRadius(currentSize * 0.12);

      const p = currentSize * 0.06;
      qrImageNode.x(p);
      qrImageNode.y(p);
      qrImageNode.width(currentSize - (p * 2));
      qrImageNode.height(currentSize - (p * 2));

      const newBadgeSize = currentSize * 0.28;
      badgeBg.x(currentSize / 2);
      badgeBg.y(currentSize / 2);
      badgeBg.radius(newBadgeSize / 2);

      const children = group.getChildren();
      if (children[3]) {
        children[3].x(currentSize / 2);
        children[3].y(currentSize / 2);
      }

      const { width: stageW, height: stageH } = getStageSize();
      entry.editorWidth = stageW;
      entry.editorHeight = stageH;
      layer.batchDraw();
    });

    group.on("dragend", () => {
      const { width: stageW, height: stageH } = getStageSize();
      entry.xRatio = group.x() / stageW;
      entry.yRatio = group.y() / stageH;
      entry.editorWidth = stageW;
      entry.editorHeight = stageH;
    });

    layer.add(group);

    const { width: stageW, height: stageH } = getStageSize();
    group.x((entry.xRatio || 0.8) * stageW);
    group.y((entry.yRatio || 0.8) * stageH);

    // Record the editor's dimensions at placement time, same as
    // createTextNode already does. Previously this only happened inside
    // the wheel/dragend handlers, so a QR code that was placed but never
    // dragged or resized had no editorWidth/editorHeight at all - leaving
    // certificate-gen.js to fall back to bogus 800x500 defaults when
    // rendering the final certificate.
    entry.editorWidth = stageW;
    entry.editorHeight = stageH;

    imageNodes.set(key, group);
    layer.batchDraw();
  };
  qrImg.src = qrApiUrl;
};

const destroyTextNode = (key) => {
  const node = textNodes.get(key);
  if (node) {
    node.destroy();
    textNodes.delete(key);
  }
};

const destroyImageNode = (key) => {
  const node = imageNodes.get(key);
  if (node) {
    node.destroy();
    imageNodes.delete(key);
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
    for (const [key, node] of imageNodes.entries()) positionNode(key, node);
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
    
    for (const [key, group] of imageNodes.entries()) {
      const entry = newMap[key];
      if (entry && entry.size && key === 'qr_code') {
        const size = entry.size;
        group.width(size);
        group.height(size);
        group.offsetX(size / 2);
        group.offsetY(size / 2);
        
        const children = group.getChildren();
        if (children[0]) {
          children[0].width(size);
          children[0].height(size);
          children[0].cornerRadius(size * 0.12);
        }
        if (children[1]) {
          const p = size * 0.06;
          children[1].x(p);
          children[1].y(p);
          children[1].width(size - (p * 2));
          children[1].height(size - (p * 2));
        }
        if (children[2]) {
          const badgeSize = size * 0.28;
          children[2].x(size / 2);
          children[2].y(size / 2);
          children[2].radius(badgeSize / 2);
        }
        if (children[3]) {
          children[3].x(size / 2);
          children[3].y(size / 2);
        }
      }
    }
    layer?.batchDraw();
  },
  { deep: true }
);

watch(
  () => props.fieldValues,
  () => {
    for (const [key, node] of textNodes.entries()) {
      node.text(props.fieldValues[key] ?? key);
      centerTextOrigin(node);
    }
    if (props.variableMap['qr_code']) {
      destroyImageNode('qr_code');
      createQRCodeNode('qr_code');
    }
    layer?.batchDraw();
  },
  { deep: true },
);
</script>

<template>
  <div ref="containerEl" class="w-full h-full cursor-crosshair"></div>
</template>