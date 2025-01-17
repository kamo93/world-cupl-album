import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { swcReactRefresh } from 'vite-plugin-swc-react-refresh'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'app'),
  publicDir: resolve(__dirname, 'public'),
  clearScreen: false,
  build: {
    sourcemap: true,
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  envDir: __dirname,
  plugins: [
    swcReactRefresh(),
    VitePWA({
      base: '/',
      mode: 'development',
      strategies: 'injectManifest',
      manifest: {
        id: 'album-app',
        name: 'World Cup Album Share',
        short_name: 'WC album',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        lang: 'es',
        scope: '/',
        icons: [
          {
            src: 'public/icon_192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'public/icon_512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'public/icon_512.png',
            sizes: '512x512',
            type: 'image/png',
            purpuse: 'any maskable'
          }
        ]
      },
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**\/*.{ts,js,css,html}']
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
      // manifestFilename: 'manifest.webmanifest'
    })
  ],
  esbuild: { jsx: 'automatic' },
  server: {
    port: 5173, // vite default
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  }
})
