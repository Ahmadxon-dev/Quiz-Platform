import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
// import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
    // viteCompression({
    //   algorithm: 'gzip',
    //   ext: '.gz',
    //   threshold: 10240, // Compress files larger than 10KB
    //   deleteOriginFile: false // Keep original files
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
