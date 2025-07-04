import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'process.browser': true,
  },
  build: {
    rollupOptions: {
      external: ['leaflet']
    }
  },
  optimizeDeps: {
    exclude: ['leaflet']
  },
  ssr: {
    noExternal: ['react-leaflet']
  }
});
