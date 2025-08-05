<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Mock Dashboard</div>
      </q-card-section>
      <q-table :rows="rows" :columns="columns" row-key="id" flat />
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { QTableColumn } from 'quasar';

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const columns: QTableColumn[] = [
      { name: 'item', label: 'Item', field: 'item', align: 'left' as const },
      {
        name: 'amount',
        label: 'Amount',
        field: 'amount',
        align: 'right' as const,
        format: (val: number) => `$${val.toFixed(2)}`
      }
    ];

    const rows = [
      { id: 1, item: 'Income', amount: 5000 },
      { id: 2, item: 'Expenses', amount: 3000 }
    ];

    return { columns, rows };
  }
});
</script>
