<template>
  <q-form @submit.prevent="submit" class="q-pa-md column q-gutter-md" style="height: 100%; overflow: auto; max-width: 400px;">
    <q-input v-model="form.description" label="Description" filled />
    <q-input v-model.number="form.amount" type="number" label="Amount" filled />
    <div>
      <q-btn label="Add" color="primary" type="submit" />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'ExpenseInput',
  setup() {
    const form = reactive({ description: '', amount: 0 });

    function submit() {
      form.description = '';
      form.amount = 0;
    }

    return { form, submit };
  }
});
</script>
