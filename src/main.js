// root directory
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";
import { createPinia } from "pinia";

const pinia = createPinia();

// Create the app instance first
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");
