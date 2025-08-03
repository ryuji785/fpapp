<template>
  <div class="cash-flow-panel">
    <h2>Monthly Cash Flow</h2>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Income</th>
          <th>Expenses</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in mockData" :key="index">
          <td>{{ row.month }}</td>
          <td>{{ row.income }}</td>
          <td>{{ row.expenses }}</td>
          <td>{{ row.balance }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface CashFlowRow {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

const mockData: CashFlowRow[] = [
  { month: 'Jan', income: 300000, expenses: 200000, balance: 100000 },
  { month: 'Feb', income: 280000, expenses: 180000, balance: 100000 },
  { month: 'Mar', income: 320000, expenses: 210000, balance: 110000 }
];
</script>

<style scoped>
.cash-flow-panel {
  padding: 1rem;
  background-color: #fff;
  height: 100%;
  width: 100%;
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: right;
}

th {
  background-color: #f0f0f0;
}
</style>
