<template>
  <div class="techdocs-page">
    <iframe
      class="techdocs-frame"
      src="/docs.html"
      title="Technical Documentation"
      loading="eager"
    ></iframe>
  </div>
</template>

<style scoped>
.techdocs-page {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #0f1f1a;
}

.techdocs-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
