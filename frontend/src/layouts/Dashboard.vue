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

      const layout = new GoldenLayout(config, layoutEl.value);

      layout.registerComponentConstructor('monthly-graph', container => {
        const el = document.createElement('div');
        container.element.append(el);
        createApp(MonthlyGraph).mount(el);
      });

      layout.registerComponentConstructor('card-statement', container => {
        const el = document.createElement('div');
        container.element.append(el);
        createApp(CardStatement).mount(el);
      });

      layout.registerComponentConstructor('expense-input', container => {
        const el = document.createElement('div');
        container.element.append(el);
        createApp(ExpenseInput).mount(el);
      });

      layout.registerComponentConstructor('expense-breakdown', container => {
        const el = document.createElement('div');
        container.element.append(el);
        createApp(ExpenseBreakdown).mount(el);
      });

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
