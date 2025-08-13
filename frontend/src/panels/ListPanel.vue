<template>
  <div class="q-pa-md column q-gutter-md">
    <div class="row items-center q-gutter-sm">
      <q-input v-model="month" type="month" label="月" class="col-3" />
      <q-chip v-for="c in chips" :key="c" clickable>{{ c }}</q-chip>
    </div>
    <q-table :rows="rows" :columns="columns" row-key="id">
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="edit" class="q-mr-xs" />
          <q-btn flat dense icon="delete" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatJPY } from '@/utils/format'
const month = ref('2024-01')
const chips = ['全て', '収入', '支出']
const columns = [
  { name: 'date', label: '日付', field: 'date' },
  { name: 'category', label: 'カテゴリ', field: 'category' },
  { name: 'amount', label: '金額', field: 'amount', format: (val:number)=>formatJPY(val) },
  { name: 'actions', label: '', field: 'actions' }
]
const rows = [
  { id: 1, date: '2024-01-01', category: '給与', amount: 250000 },
  { id: 2, date: '2024-01-02', category: '食費', amount: -5000 }
]
</script>
