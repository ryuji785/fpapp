<template>
  <div class="q-pa-md">
    <PageTitle title="Settings" />
    <q-form @submit.prevent="save">
      <FormGroup v-model="form.username" label="Username" />
      <FormGroup v-model="form.currency" label="Currency" />
      <ActionButtons @submit="save" @cancel="reset" />
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import PageTitle from '../components/common/PageTitle.vue';
import FormGroup from '../components/common/FormGroup.vue';
import ActionButtons from '../components/common/ActionButtons.vue';

export default defineComponent({
  name: 'SettingsView',
  components: { PageTitle, FormGroup, ActionButtons },
  setup() {
    const form = reactive({ username: 'User', currency: 'USD' });
    function save() {
      console.log(form);
    }
    function reset() {
      form.username = 'User';
      form.currency = 'USD';
    }
    return { form, save, reset };
  }
});
</script>
