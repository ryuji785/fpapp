<template>
  <div class="q-pa-md" style="height: 100%; overflow: auto;">
    <h2 class="text-subtitle1 q-mb-md">口座一覧</h2>
    <q-table :rows="rows" :columns="columns" row-key="name" flat dense />
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import { formatYen } from '../utils/format';

interface Row {
  name: string;
  balance: number;
  type: string;
}

const rows: Row[] = [
  { name: '普通預金', balance: 300000, type: '銀行' },
  { name: '投資口座', balance: 500000, type: '証券' },
  { name: '現金', balance: 20000, type: '現金' }
];

const columns: QTableColumn<Row>[] = [
  { name: 'name', label: '口座名', field: 'name', align: 'left' as const },
  {
    name: 'balance',
    label: '残高',
    field: 'balance',
    align: 'right' as const,
    format: formatYen
  },
  { name: 'type', label: '種別', field: 'type', align: 'left' as const }
];
</script>
