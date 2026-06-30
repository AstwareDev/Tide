import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: './electron/main.js' },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: './electron/preload.js' },
    },
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: { input: './index.html' },
    },
    plugins: [react()],
  },
})
