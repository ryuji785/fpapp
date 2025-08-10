<template>
  <q-layout view="lHh Lpr lFf">
    <TopAppBar
      :isDrawerOpen="drawerOpen"
      :username="username"
      @toggle-drawer="toggleDrawer"
    />
    <SideMenu v-model="drawerOpen" :items="menuItems" @open="openPanel" />
    <q-page-container>
      <q-page class="fit">
        <div id="golden-container" ref="glContainer" class="full-width full-height"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TopAppBar from '../components/TopAppBar.vue';
import SideMenu from '../components/SideMenu.vue';
import { provideGoldenLayout } from '../composables/useGoldenLayout';
import { menuItems } from '../panels';

const drawerOpen = ref(true);
const username = 'User';
const { container: glContainer, addPanel } = provideGoldenLayout('dashboard');

function openPanel(key: string, _newInstance = false) {
  addPanel(key);
}

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}
</script>
