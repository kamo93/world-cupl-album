import { defineConfig } from 'vite'
import { swcReactRefresh } from 'vite-plugin-swc-react-refresh'
import { join, resolve } from 'path'

console.log('jon', join(__dirname, 'src/app'))
console.log('jon', resolve(__dirname, 'src/app'))
// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'app'),
  publicDir: resolve(__dirname, 'app/public'),
  clearScreen: false,
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  envDir: __dirname,
  plugins: [swcReactRefresh()],
  esbuild: { jsx: 'automatic' },
  server: {
    open: true
  }
})
