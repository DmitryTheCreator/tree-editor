import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "@nabla/vite-plugin-eslint";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue(), eslintPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/app/styles/index" as *;`,
      },
    },
  },
});
