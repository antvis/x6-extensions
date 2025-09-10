import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: './demo/',
  server: {
    port: 8080,
    open: '/',
  },
  plugins: [react()],
})
