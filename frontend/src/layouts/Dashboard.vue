<template>
  <div ref="layoutEl" class="dashboard-layout"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, createApp } from 'vue';
import { GoldenLayout, type LayoutConfig } from 'golden-layout';
import MonthlyGraph from '../components/MonthlyGraph.vue';
import CardStatement from '../components/CardStatement.vue';
import ExpenseInput from '../components/ExpenseInput.vue';
import ExpenseBreakdown from '../components/ExpenseBreakdown.vue';

// minimal container interface expected by Golden Layout when mounting a component
interface GLContainer {
  element: HTMLElement;
}

// custom factory type to avoid relying on non-exported library types
type GLComponentFactory = (container: GLContainer, state?: unknown) => void;

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const layoutEl = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (!layoutEl.value) return;

      const config: LayoutConfig = {
        root: {
          type: 'row',
          content: [
            {
              type: 'column',
              content: [
                {
                  type: 'component',
                  componentType: 'monthly-graph',
                  title: 'Monthly Cashflow'
                },
                {
                  type: 'component',
                  componentType: 'card-statement',
                  title: 'Credit Card Statement'
                }
              ]
            },
            {
              type: 'column',
              content: [
                {
                  type: 'component',
                  componentType: 'expense-input',
                  title: 'Expense Input'
                },
                {
                  type: 'component',
                  componentType: 'expense-breakdown',
                  title: 'Expense Breakdown'
                }
              ]
            }
          ]
        }
      };

      const layout = new GoldenLayout(config, layoutEl.value) as any;

      const mount = (Comp: any): GLComponentFactory => container => {
        const el = document.createElement('div');
        container.element.append(el);
        createApp(Comp).mount(el);
      };

      layout.registerComponentFactoryFunction('monthly-graph', mount(MonthlyGraph));
      layout.registerComponentFactoryFunction('card-statement', mount(CardStatement));
      layout.registerComponentFactoryFunction('expense-input', mount(ExpenseInput));
      layout.registerComponentFactoryFunction('expense-breakdown', mount(ExpenseBreakdown));

      layout.init();
    });

    return { layoutEl };
  }
});
</script>

<style>
html, body, .dashboard-layout {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>
