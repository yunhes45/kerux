import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/v1/members': {
        target: 'http://localhost:8080',
      },
      '/api/v1/auth': {
        target: 'http://localhost:8080',
      },
      '/api': {
        target: 'http://localhost:8081',
        ws: true,
      },
    },
  },
})