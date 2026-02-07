import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugins: [react()],
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  }
})
