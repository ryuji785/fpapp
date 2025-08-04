<template>
  <div class="q-pa-md">
    <q-table
      title="Accounts"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup lang="ts">
const columns = [
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'value', label: 'Value', field: 'value', align: 'right' }
];

const rows = [
  { name: 'Savings', value: 1000 },
  { name: 'Investments', value: 5000 },
  { name: 'Cash', value: 300 }
];
</script>
