import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar(),
  ],
  resolve: {
    alias: {
      // force use of Node's built-in crypto
      crypto: 'node:crypto',
    },
  },
  optimizeDeps: {
    // avoid pulling in browser crypto polyfills
    exclude: ['crypto'],
  },
});
