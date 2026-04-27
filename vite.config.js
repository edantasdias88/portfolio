import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'spa',
  server: {
    fs: {
      strict: false
    }
  }
})