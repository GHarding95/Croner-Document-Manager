import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensure static files like robots.txt are served correctly
    fs: {
      strict: false
    }
  },
  build: {
    // Ensure robots.txt is copied to build output
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
