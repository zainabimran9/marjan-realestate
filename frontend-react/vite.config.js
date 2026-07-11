import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo at /marjan-realestate/, so every asset
// path needs that prefix in production. Vite's dev server still runs at
// the root locally, this only affects the production build.
export default defineConfig({
  plugins: [react()],
  base: '/marjan-realestate/',
  build: {
    outDir: 'dist'
  }
})
