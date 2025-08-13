<template>
  <q-drawer v-model="drawer" show-if-above bordered>
    <q-list>
      <q-item clickable v-ripple to="/">
        <q-item-section>Dashboard</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue']);
const drawer = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
</script>
