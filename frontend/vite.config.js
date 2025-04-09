import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() ],

  server: {
    allowedHosts: ['d5dd-182-189-15-42.ngrok-free.app','cbd0-182-189-15-42.ngrok-free.app'],
  },
})
