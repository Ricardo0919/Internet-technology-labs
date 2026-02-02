import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://193.197.231.20:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
      "/ws": {
        target: "ws://193.197.231.20:8080",
        ws: true,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ws/, ""),
      },
    },
  },
});
