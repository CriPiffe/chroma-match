import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import TanStackRouterVite from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/chroma-match/',
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      routeFileIgnorePattern: '.css',
      quoteStyle: 'single',
    }),
    react(),
  ],
})
