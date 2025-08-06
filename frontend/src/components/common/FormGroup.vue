<template>
  <q-input :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)" :label="label" :type="type" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormGroup',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  emits: ['update:modelValue']
});
</script>
