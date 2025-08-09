<template>
  <div class="text-h5 q-mb-md">{{ title }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script>
