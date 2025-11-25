import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: './demo/',
  server: {
    port: 8081,
    open: '/',
  },
  plugins: [vue()],
})
