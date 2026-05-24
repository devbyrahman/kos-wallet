import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // split vendor packages into separate bundles for improved caching and load speed
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'supabase'
            }
            if (id.includes('recharts')) {
              return 'recharts'
            }
            if (id.includes('jspdf') || id.includes('jspdf-autotable')) {
              return 'pdf'
            }
            if (id.includes('lucide-react')) {
              return 'lucide'
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
