import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('react-router')) return 'router';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('/react/') || id.includes('react-dom') || id.includes('scheduler') || id.includes('use-sync-external-store')) return 'react-core';
          return undefined;
        },
      },
    },
  },
});
