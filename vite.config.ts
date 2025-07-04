import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',                  // 👈 necessary for Render
    port: parseInt(process.env.PORT) || 5173,  // 👈 use Render's port
  },
})
