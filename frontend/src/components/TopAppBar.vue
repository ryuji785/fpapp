<template>
  <q-header elevated class="bg-green-500 text-white">
    <q-toolbar>
      <q-btn flat dense round icon="menu" @click="emit('toggle-drawer')" />
      <q-toolbar-title>FPApp</q-toolbar-title>
      <q-btn flat dense round icon="account_circle" />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const emit = defineEmits(['toggle-drawer']);
</script>
