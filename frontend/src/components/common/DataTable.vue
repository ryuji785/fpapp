<template>
  <q-markup-table flat bordered>
    <thead>
      <slot name="header" />
    </thead>
    <tbody>
      <slot name="body" />
    </tbody>
  </q-markup-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DataTable'
});
</script>
