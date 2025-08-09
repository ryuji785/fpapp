<template>
  <div class="q-pa-md">
    <PageTitle title="Dashboard" />
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <SummaryCard title="Income" :value="income" />
      </div>
      <div class="col-12 col-sm-4">
        <SummaryCard title="Expense" :value="expense" />
      </div>
      <div class="col-12 col-sm-4">
        <SummaryCard title="Balance" :value="balance" />
      </div>
    </div>
    <ChartPanel title="Income vs Expense" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageTitle from '../components/common/PageTitle.vue';
import SummaryCard from '../components/common/SummaryCard.vue';
import ChartPanel from '../components/common/ChartPanel.vue';

export default defineComponent({
  name: 'DashboardView',
  components: { PageTitle, SummaryCard, ChartPanel },
  setup() {
    const income = 5000;
    const expense = 3000;
    const balance = 2000;
    return { income, expense, balance };
  }
});
</script>
