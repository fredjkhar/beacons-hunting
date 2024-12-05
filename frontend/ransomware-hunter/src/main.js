// main.js

// import "./assets/base.css";
// import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './assets/main.css'; // Import global CSS

createApp(App).use(router).mount("#app");