import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  const apiUrl = env.VITE_API_URL || 'http://localhost:3000';

  console.log(`🔌 Configurando proxy a: ${apiUrl}`);

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false, // Permitir certificados autofirmados si es necesario
        }
      }
    }
  }
})