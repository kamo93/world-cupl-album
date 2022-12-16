import { defineConfig } from 'vite'
import { swcReactRefresh } from 'vite-plugin-swc-react-refresh'
import { join, resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'app'),
  publicDir: resolve(__dirname, 'public'),
  clearScreen: false,
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  envDir: __dirname,
  plugins: [swcReactRefresh()],
  esbuild: { jsx: 'automatic' },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  }
})
