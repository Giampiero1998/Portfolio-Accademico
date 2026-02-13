import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Configurazione Server
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      }
    }
  },

  // Configurazione Test
  test: {
    globals: true,             // Permette di usare describe, it, expect senza importarli
    environment: 'jsdom',      // Simula il browser (DOM) necessario per React
    setupFiles: './src/setupTests.js', // Punta al file di setup che abbiamo creato
    css: false,                // Ignora il parsing CSS nei test
  },
});