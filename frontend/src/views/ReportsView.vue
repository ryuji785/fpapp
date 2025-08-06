<template>
  <div class="q-pa-md">
    <PageTitle title="Reports" />
    <ChartPanel title="Yearly Summary" />
    <div class="q-mt-md">
      <DataTable>
        <template #header>
          <tr>
            <th>Month</th>
            <th class="text-right">Income</th>
            <th class="text-right">Expense</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="row in rows" :key="row.month">
            <td>{{ row.month }}</td>
            <td class="text-right">{{ row.income }}</td>
            <td class="text-right">{{ row.expense }}</td>
          </tr>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageTitle from '../components/common/PageTitle.vue';
import ChartPanel from '../components/common/ChartPanel.vue';
import DataTable from '../components/common/DataTable.vue';

export default defineComponent({
  name: 'ReportsView',
  components: { PageTitle, ChartPanel, DataTable },
  setup() {
    const rows = [
      { month: 'Jan', income: 5000, expense: 3000 },
      { month: 'Feb', income: 5200, expense: 2800 }
    ];
    return { rows };
  }
});
</script>
