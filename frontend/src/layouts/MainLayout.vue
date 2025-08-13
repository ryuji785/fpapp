<template>
  <div ref="layout" style="height:100%;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { GoldenLayout } from 'golden-layout';
import { createApp } from 'vue';
import DashboardView from '@/views/DashboardView.vue';
import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-light-theme.css';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const layout = ref<HTMLDivElement | null>(null);
    onMounted(() => {
      if (layout.value) {
        const gl = new GoldenLayout(layout.value);
        gl.registerComponentFactoryFunction('dashboard', (container) => {
          const el = document.createElement('div');
          container.element.append(el);
          createApp(DashboardView).mount(el);
        });
        gl.loadLayout({
          root: {
            type: 'row',
            content: [
              { type: 'component', componentType: 'dashboard', title: 'Dashboard' }
            ]
          }
        });
      }
    });
    return { layout };
  }
});
</script>
