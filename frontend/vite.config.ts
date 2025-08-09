import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar()
  ],
  resolve: {
    alias: {
      crypto: 'node:crypto'
    }
  },
  optimizeDeps: {
    exclude: ['crypto']
  }
});
