import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/dashboard': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/m365': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/alerts': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    host: true,
    port: 5173,
    strictPort: true
  }
})