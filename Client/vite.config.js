import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
   server: {
    host: '0.0.0.0',
    
  }
})