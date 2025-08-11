<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Fixed Header -->
    <TopAppBar :username="username" :showMenuToggle="false" />

    <!-- Fixed Left Menu (permanently visible, not overlay) -->
      <SideMenu :items="menuItems" @open="openPanel" />

    <!-- Content area driven by GoldenLayout -->
    <q-page-container>
      <q-page class="fit no-padding">
        <div id="golden-container" ref="glContainer" class="gl-host"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { provideGoldenLayout } from '../composables/useGoldenLayout';
import TopAppBar from '../components/TopAppBar.vue';
import SideMenu from '../components/SideMenu.vue';
import { menuItems } from '../panels';

const username = 'User';

// initialize GoldenLayout with default layout
const { container: glContainer, addPanel } = provideGoldenLayout('dashboard');

function openPanel(key: string, newInstance = false) {
  addPanel(key, newInstance);
}
</script>

<style scoped>
.gl-host {
  position: absolute;
  inset: 0;
  height: 100%;
}
</style>

