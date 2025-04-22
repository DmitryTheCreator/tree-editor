import { createApp } from "vue";
import { registerAgGrid } from "./providers";
import App from "./App.vue";

registerAgGrid();
export const app = createApp(App);
