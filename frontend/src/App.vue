<template>
  <div ref="layoutEl" class="layout"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, createApp } from 'vue';
import { GoldenLayout, type LayoutConfig } from 'golden-layout';
import CashFlowPanel from './components/CashFlowPanel.vue';

const layoutEl = ref<HTMLDivElement | null>(null);
let layout: GoldenLayout | null = null;

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

  const gl = new GoldenLayout(config, layoutEl.value);

  gl.registerComponentConstructor('cash-flow', container => {
    const el = document.createElement('div');
    container.element.appendChild(el);
    createApp(CashFlowPanel).mount(el);
  });

  gl.init();

  layout = gl;
});
</script>

<style>
html, body, #app, .layout {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
