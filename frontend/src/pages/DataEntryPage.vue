<template>
  <q-form @submit="onSubmit" class="q-pa-md">
    <q-input v-model="name" label="Name" />
    <q-input v-model.number="amount" type="number" label="Amount" class="q-mt-md" />
    <div class="q-mt-lg">
      <q-btn label="Submit" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');
const amount = ref<number | null>(null);

function onSubmit() {
  console.log('Submitted', { name: name.value, amount: amount.value });
}
</script>
