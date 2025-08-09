<template>
  <div class="q-pa-md" style="height: 100%; overflow: auto;">
    <h2 class="text-subtitle1 q-mb-md">月次キャッシュフロー</h2>
    <q-table :rows="rows" :columns="columns" row-key="month" flat dense />
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import { formatYen } from '../utils/format';

interface Row {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

const rows: Row[] = [
  { month: '1月', income: 300000, expenses: 200000, balance: 100000 },
  { month: '2月', income: 280000, expenses: 180000, balance: 100000 },
  { month: '3月', income: 320000, expenses: 210000, balance: 110000 }
];

const columns: QTableColumn<Row>[] = [
  { name: 'month', label: '月', field: 'month', align: 'left' as const },
  {
    name: 'income',
    label: '収入',
    field: 'income',
    align: 'right' as const,
    format: formatYen
  },
  {
    name: 'expenses',
    label: '支出',
    field: 'expenses',
    align: 'right' as const,
    format: formatYen
  },
  {
    name: 'balance',
    label: '差引',
    field: 'balance',
    align: 'right' as const,
    format: formatYen
  }
];
</script>
