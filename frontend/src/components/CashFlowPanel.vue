<template>
  <div class="cash-flow-panel">
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Inflow</th>
          <th>Outflow</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>January</td>
          <td>$5,000</td>
          <td>$4,500</td>
        </tr>
        <tr>
          <td>February</td>
          <td>$5,200</td>
          <td>$4,700</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CashFlowPanel',
  setup() {
    // Placeholder for cash flow data
    return {};
  }
});
</script>

<style scoped>
.cash-flow-panel {
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
</style>
