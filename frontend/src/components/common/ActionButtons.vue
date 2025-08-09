<template>
  <div class="row q-gutter-sm q-mt-md">
    <q-btn color="primary" label="Submit" @click="$emit('submit')" />
    <q-btn flat label="Cancel" @click="$emit('cancel')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ActionButtons',
  emits: ['submit', 'cancel']
});
</script>
