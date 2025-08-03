<template>
  <form class="expense-input" @submit.prevent="submit">
    <input v-model="form.description" placeholder="Description" />
    <input v-model.number="form.amount" type="number" placeholder="Amount" />
    <button type="submit">Add</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({ description: '', amount: 0 });

function submit() {
  // Placeholder: would dispatch to Pinia store
  form.description = '';
  form.amount = 0;
}
</script>

<style scoped>
.expense-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
}
</style>
