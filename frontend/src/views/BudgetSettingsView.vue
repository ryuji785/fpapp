<template>
  <div class="q-pa-md">
    <PageTitle title="Budget Settings" />
    <DataTable>
      <template #header>
        <tr>
          <th class="text-left">Category</th>
          <th class="text-right">Amount</th>
        </tr>
      </template>
      <template #body>
        <tr v-for="row in rows" :key="row.category">
          <td>{{ row.category }}</td>
          <td class="text-right">
            <q-input v-model.number="row.amount" type="number" dense />
          </td>
        </tr>
      </template>
    </DataTable>
    <div class="q-mt-md">
      <q-btn color="primary" label="Save" @click="onSave" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import PageTitle from '../components/common/PageTitle.vue';
import DataTable from '../components/common/DataTable.vue';

export default defineComponent({
  name: 'BudgetSettingsView',
  components: { PageTitle, DataTable },
  setup() {
    const rows = reactive([
      { category: 'Food', amount: 300 },
      { category: 'Rent', amount: 1000 }
    ]);
    function onSave() {
      console.log(rows);
    }
    return { rows, onSave };
  }
});
</script>
