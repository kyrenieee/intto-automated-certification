// root directory (all connections will be done here)
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import LiquidGlass from '@wxperia/liquid-glass-vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')