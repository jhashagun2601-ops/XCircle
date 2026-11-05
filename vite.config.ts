import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

import fs from 'fs';

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
    plugins: [react(), tailwindcss(), configureSupabasePlugin()],
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
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
