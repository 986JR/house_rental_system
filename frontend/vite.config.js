import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the project root (one level up from /frontend)
  const env = loadEnv(mode, path.resolve(__dirname, '..'), 'VITE_')

  return {
    plugins: [react()],
    build: {
      outDir: '../backend/src/main/resources/static',
      emptyOutDir: true,
    },
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
        }
      }
    }
  }
})
