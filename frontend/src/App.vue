<template>
  <div ref="layoutEl" class="layout"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, createApp } from 'vue';
import { GoldenLayout, type LayoutConfig } from 'golden-layout';
import CashFlowPanel from './components/CashFlowPanel.vue';

// minimal container interface expected by Golden Layout when mounting a component
interface GLContainer {
  element: HTMLElement;
}

// custom constructor type to avoid relying on non-exported library types
type GLComponentConstructor = (container: GLContainer, state?: unknown) => void;

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

      const cashFlowCtor: GLComponentConstructor = container => {
        const el = document.createElement('div');
        container.element.append(el);
        createApp(CashFlowPanel).mount(el);
      };

      layout.registerComponentFactoryFunction('cash-flow', cashFlowCtor);

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
