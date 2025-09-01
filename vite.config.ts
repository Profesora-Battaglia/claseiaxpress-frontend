import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['react-icons/fi']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-icons': ['react-icons/fi']
        },
      },
    },
  },
}));