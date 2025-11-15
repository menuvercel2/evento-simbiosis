import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Esto permite que las funciones de la API se manejen correctamente en desarrollo
    proxy: {
      '/api': 'http://localhost:3000' // Asume que el servidor de funciones corre en el puerto 3000
    }
  }
})