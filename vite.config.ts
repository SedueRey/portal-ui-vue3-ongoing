import { URL, fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { readFileSync } from 'fs';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default (env: { mode: string }) => {
  const mode: string = env.mode;
  const envCustomVariables = loadEnv(mode, './');
  if (mode === 'development' && Object.entries(envCustomVariables).length === 0) {
    throw new Error('[ No hay variables de entorno definidas para el proxy ]');
  }
  let key = undefined;
  let cert = undefined;
  if (mode === 'development') {
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
    plugins: mode === 'development' ? [vue(), basicSsl(), vueDevTools()] : [vue(), basicSsl()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
