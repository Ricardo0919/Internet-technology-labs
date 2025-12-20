import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite configuration for local development.
// The proxy is used to avoid CORS issues and to keep API calls consistent
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to the external API host
      "/api": {
        target: "https://rest.arbeitsagentur.de",
        // Makes the request look like it comes from the target host (required by some APIs)
        changeOrigin: true,
        // Keep HTTPS verification enabled (good practice for secure endpoints)
        secure: true,
        // Removes the /api prefix before forwarding, so the upstream receives the expected path
        // e.g. /api/jobboerse/jobs -> https://rest.arbeitsagentur.de/jobboerse/jobs
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
