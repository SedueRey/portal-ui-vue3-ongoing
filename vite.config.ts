import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';
import { readFileSync } from 'fs';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

// https://vite.dev/config/
export default (env: { mode: string }) => {
  const mode: string = env.mode;
  const envCustomVariables = loadEnv(mode, './');
  if (mode === 'development' && Object.entries(envCustomVariables).length === 0) {
    throw new Error('[ No hay variables de entorno definidas para el proxy ]');
  }
  let key = undefined;
  let cert = undefined;
  const isDevelopment = mode.indexOf('development') !== -1;
  if (isDevelopment) {
    try {
      key = readFileSync('.certs/key.pem') || false;
      cert = readFileSync('.certs/cert.pem') || false;
    } catch (_err) {
      throw new Error('[ No se han instalado los certificados. Hace falta la carpeta .certs ]');
    }
  }
  process.env = { ...process.env, ...envCustomVariables };
  const host = process?.env?.VITE_APP_LOCAL_URL || '0.0.0.0';
  return defineConfig({
    base: './',
    plugins: [
      vue(),
      basicSsl(),
      vueDevTools(),
      VueI18nPlugin({
        /* options */
        // locale messages resource pre-compile option
        include: [path.resolve(__dirname, './src/locales/**')],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@import "@/app/shared/assets/_vars.scss";',
          silenceDeprecations: ['legacy-js-api', 'mixed-decls', 'import'],
          quietDeps: true,
        },
      },
    },
    server: {
      host,
      https: {
        key,
        cert,
      },
      proxy: {
        '/env-config.js': {
          target: process.env.VITE_APP_API_ENVIRONMENT,
          changeOrigin: true,
        },
      },
    },
  });
};
