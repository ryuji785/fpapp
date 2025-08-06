<template>
  <q-card class="q-pa-md">
    <div class="text-subtitle1">{{ title }}</div>
    <div class="q-mt-md">
      <slot>
        <div class="bg-grey-3" style="height:200px;"></div>
      </slot>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChartPanel',
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script>
