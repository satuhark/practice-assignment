import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 3001,
    },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/mocks/server.js', 
  }
})
