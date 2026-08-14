import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5174 by default so this can run alongside the car show site (5173).
  server: { port: Number(process.env.PORT) || 5174 },
})
