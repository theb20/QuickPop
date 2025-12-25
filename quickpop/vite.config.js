import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: null, 
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.png', 'imgs/*.png', 'imgs/*.jpg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
     manifest: {
  name: 'QuickPop Streaming',
  short_name: 'QuickPop',
  description: 'QuickPop - Plateforme de streaming vidéo',
  theme_color: '#d80022',
  background_color: '#d80022',
  display: 'standalone',
  scope: '/',
  start_url: '/',
  icons: [
    {
      src: '/imgs/logo-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/imgs/logo-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/imgs/logo-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
}

    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3005,
  },
})
