<template>
  <div class="q-pa-md" style="height: 100%; overflow: auto;">
    <h2 class="text-subtitle1 q-mb-md">予算達成状況</h2>
    <q-table :rows="rows" :columns="columns" row-key="category" flat dense>
      <template #body-cell-rate="{ row }">
        <div class="full-width">
          <q-linear-progress :value="row.actual / row.budget" color="primary" track-color="grey-3" />
          <div class="text-right text-caption">{{ rate(row.actual, row.budget) }}</div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import { formatYen } from '../utils/format';

interface Row {
  category: string;
  budget: number;
  actual: number;
}

const rows: Row[] = [
  { category: '食費', budget: 50000, actual: 45000 },
  { category: '交通費', budget: 10000, actual: 8000 },
  { category: '娯楽', budget: 15000, actual: 12000 }
];

const columns: QTableColumn<Row>[] = [
  { name: 'category', label: 'カテゴリ', field: 'category', align: 'left' as const },
  {
    name: 'budget',
    label: '予算',
    field: 'budget',
    align: 'right' as const,
    format: formatYen
  },
  {
    name: 'actual',
    label: '実績',
    field: 'actual',
    align: 'right' as const,
    format: formatYen
  },
  { name: 'rate', label: '達成率', field: 'rate', align: 'left' as const }
];

function rate(actual: number, budget: number) {
  return `${Math.round((actual / budget) * 100)}%`;
}
</script>
