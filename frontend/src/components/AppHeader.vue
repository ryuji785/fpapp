<template>
  <q-header elevated class="bg-green-7 text-white">
    <q-toolbar>
      <q-btn flat dense round @click="toggleDrawer">
        <transition name="rotate" mode="out-in">
          <q-icon :key="drawer" :name="drawer ? 'close' : 'menu'" />
        </transition>
      </q-btn>
      <q-toolbar-title class="text-center">FPApp</q-toolbar-title>
      <q-icon name="account_circle" />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const props = defineProps<{ drawer: boolean }>();
const emit = defineEmits<{ (e: 'update:drawer', value: boolean): void }>();

function toggleDrawer() {
  emit('update:drawer', !props.drawer);
}
</script>

<style scoped>
.rotate-enter-active, .rotate-leave-active {
  transition: transform 0.2s ease;
}
.rotate-enter-from, .rotate-leave-to {
  transform: rotate(180deg);
}
</style>
