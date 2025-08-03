<template>
  <div class="expense-breakdown">
    <div class="table">Expense Breakdown Table</div>
    <div class="chart">Pie Chart</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExpenseBreakdown',
  setup() {
    // Placeholder: would use Pinia store for breakdown data
    return {};
  }
});
</script>

<style scoped>
.expense-breakdown {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
.table {
  flex: 1;
}
.chart {
  flex: 1;
}
</style>
