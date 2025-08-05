<template>
  <q-header elevated class="bg-green-7 text-white">
    <q-toolbar>
      <q-btn flat dense round @click="toggleDrawer">
        <transition name="rotate" mode="out-in">
          <q-icon :key="drawer ? 'close' : 'open'" :name="drawer ? 'close' : 'menu'" />
        </transition>
      </q-btn>
      <q-toolbar-title class="text-center">FPApp</q-toolbar-title>
      <q-icon name="account_circle" />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';

export default defineComponent({
  name: 'AppHeader',
  props: {
    drawer: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:drawer'],
  setup(props, { emit }) {
    const drawer = toRef(props, 'drawer');

    function toggleDrawer() {
      emit('update:drawer', !drawer.value);
    }

    return { drawer, toggleDrawer };
  }
});
</script>

<style scoped>
.rotate-enter-active, .rotate-leave-active {
  transition: transform 0.2s ease;
}
.rotate-enter-from, .rotate-leave-to {
  transform: rotate(180deg);
}
</style>
