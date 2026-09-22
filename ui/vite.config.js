import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
      '@assets': '/src/assets'
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: '../dist/ui',
    emptyOutDir: true
  }
})
