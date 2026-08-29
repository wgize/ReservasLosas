import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // En desarrollo, /api se reenvía al backend local sin problemas de CORS.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
