import { UserConfig, mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import viteConfig from './vite.config';

export default defineConfig(async (env) => {
  const viteConfigObj = await viteConfig(env);
  const testConfigObj = await defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  });
  return mergeConfig(viteConfigObj, testConfigObj as UserConfig);
});
