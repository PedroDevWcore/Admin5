import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Admin/',
  server: {
    port: 5173,
    host: true,
    open: '/Admin/',
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
