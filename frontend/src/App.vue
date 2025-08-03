<template>
  <div ref="layoutEl" class="layout"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, createApp } from 'vue';
import { GoldenLayout, type LayoutConfig } from 'golden-layout';
import CashFlowPanel from './components/CashFlowPanel.vue';

export default defineComponent({
  name: 'App',
  setup() {
    const layoutEl = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (!layoutEl.value) return;

      const config: LayoutConfig = {
        root: {
          type: 'row',
          content: [
            {
              type: 'component',
              componentType: 'cash-flow',
              title: 'Cash Flow Table'
            }
          ]
        }
      };

      const layout = new GoldenLayout(config, layoutEl.value);

      layout.registerComponentConstructor('cash-flow', container => {
        const el = document.createElement('div');
        container.element.append(el);
        createApp(CashFlowPanel).mount(el);
      });

      layout.init();
    });

    return { layoutEl };
  }
});
</script>

<style>
html, body, #app, .layout {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
