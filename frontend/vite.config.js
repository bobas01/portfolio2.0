import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    fs: {
      allow: [".."],
    },
  },
  test: {
    environment: "happy-dom",
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
  },
});
