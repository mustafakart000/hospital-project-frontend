import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react(), eslintPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor (üçüncü parti) kütüphaneleri ayrı chunk'lara böl
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Diğer büyük kütüphaneleri de ayrı chunk'lara bölebilirsiniz
          ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // KB cinsinden
  },
  server: {
    port: 3000,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Önceden build edilecek bağımlılıklar
  }
});