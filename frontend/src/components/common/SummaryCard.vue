<template>
  <q-card class="q-pa-md">
    <div class="text-subtitle1">{{ title }}</div>
    <div class="text-h6">{{ value }}</div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SummaryCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  }
});
</script>
