<template>
  <div class="q-pa-md" style="height: 100%; overflow: auto;">
    <h2 class="q-mb-md">Monthly Cash Flow</h2>
    <q-table :rows="rows" :columns="columns" row-key="month" flat dense />
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';

interface Row {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

const rows: Row[] = [
  { month: 'Jan', income: 300000, expenses: 200000, balance: 100000 },
  { month: 'Feb', income: 280000, expenses: 180000, balance: 100000 },
  { month: 'Mar', income: 320000, expenses: 210000, balance: 110000 }
];

const columns: QTableColumn<Row>[] = [
  { name: 'month', label: 'Month', field: 'month', align: 'left' as const },
  { name: 'income', label: 'Income', field: 'income', align: 'right' as const },
  { name: 'expenses', label: 'Expenses', field: 'expenses', align: 'right' as const },
  { name: 'balance', label: 'Balance', field: 'balance', align: 'right' as const }
];
</script>
