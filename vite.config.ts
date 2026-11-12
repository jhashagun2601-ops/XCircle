import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

import fs from 'fs';
import { VitePWA } from 'vite-plugin-pwa';

const configureSupabasePlugin = () => ({
  name: 'configure-supabase-endpoint',
  configureServer(server: any) {
    server.middlewares.use('/api/configure-supabase', (req: any, res: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const url = (data.supabaseUrl || '').trim();
            const key = (data.supabaseAnonKey || '').trim();

            if (url && key) {
              const envPath = path.resolve(process.cwd(), '.env');
              let envContent = '';
              if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf-8');
              }

              if (envContent.includes('VITE_SUPABASE_URL=')) {
                envContent = envContent.replace(
                  /VITE_SUPABASE_URL=.*/g,
                  `VITE_SUPABASE_URL="${url}"`
                );
              } else {
                envContent += `\nVITE_SUPABASE_URL="${url}"`;
              }

              if (envContent.includes('VITE_SUPABASE_ANON_KEY=')) {
                envContent = envContent.replace(
                  /VITE_SUPABASE_ANON_KEY=.*/g,
                  `VITE_SUPABASE_ANON_KEY="${key}"`
                );
              } else {
                envContent += `\nVITE_SUPABASE_ANON_KEY="${key}"`;
              }

              fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');
              process.env.VITE_SUPABASE_URL = url;
              process.env.VITE_SUPABASE_ANON_KEY = key;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, configured: Boolean(url && key) }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      } else {
        res.statusCode = 405;
        res.end();
      }
    });
  },
});

export default defineConfig(({mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env vars regardless of prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const supabaseUrl =
    env.VITE_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    env.SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    '';

  const supabaseAnonKey =
    env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';

  const appUrl =
    env.APP_URL ||
    process.env.APP_URL ||
    env.VITE_APP_URL ||
    process.env.VITE_APP_URL ||
    '';
  return {
    plugins: [
      react(),
      tailwindcss(),
      configureSupabasePlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'XCircle',
          short_name: 'XCircle',
          description: 'Reconnect with school classmates, college friends, alumni, and verified communities through circles, memories, and radar discovery.',
          theme_color: '#101827',
          background_color: '#101827',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          categories: ['social', 'community', 'networking'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallbackDenylist: [/^\/api\//, /^\/auth\//],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_APP_URL': JSON.stringify(appUrl),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'process.env.APP_URL': JSON.stringify(appUrl),
    },
    envPrefix: ['VITE_', 'SUPABASE_'],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
