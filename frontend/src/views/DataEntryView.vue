<template>
  <div class="q-pa-md">
    <PageTitle title="Data Entry" />
    <q-form @submit.prevent="onSubmit">
      <FormGroup v-model="form.type" label="Type" />
      <FormGroup v-model="form.amount" label="Amount" type="number" />
      <ActionButtons @submit="onSubmit" @cancel="onCancel" />
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import PageTitle from '../components/common/PageTitle.vue';
import FormGroup from '../components/common/FormGroup.vue';
import ActionButtons from '../components/common/ActionButtons.vue';

export default defineComponent({
  name: 'DataEntryView',
  components: { PageTitle, FormGroup, ActionButtons },
  setup() {
    const form = reactive({ type: '', amount: 0 });
    function onSubmit() {
      console.log(form);
    }
    function onCancel() {
      form.type = '';
      form.amount = 0;
    }
    return { form, onSubmit, onCancel };
  }
});
</script>
