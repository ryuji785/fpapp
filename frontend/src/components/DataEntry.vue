<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-input v-model="form.name" label="Name" />
      <q-input v-model.number="form.amount" label="Amount" type="number" />
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'DataEntry',
  setup() {
    const form = ref({ name: '', amount: null as number | null });

    function onSubmit() {
      // mock submit handler
      console.log('Submitted', form.value);
    }

    return { form, onSubmit };
  }
});
</script>
