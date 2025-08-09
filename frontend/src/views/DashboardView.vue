<template>
  <div class="q-pa-md">
    <h1 class="text-h5 q-mb-md">ダッシュボード</h1>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <CashFlowPanel />
      </div>
      <div class="col-12 col-md-4">
        <BudgetProgressPanel />
      </div>
      <div class="col-12 col-md-4">
        <AccountListPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CashFlowPanel from '../components/CashFlowPanel.vue';
import BudgetProgressPanel from '../components/BudgetProgressPanel.vue';
import AccountListPanel from '../components/AccountListPanel.vue';
</script>
