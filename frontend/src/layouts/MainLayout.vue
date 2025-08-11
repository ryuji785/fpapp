<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Fixed Header -->
    <TopAppBar :username="username" :showMenuToggle="false" />

    <!-- Fixed Left Menu (permanently visible, not overlay) -->
    <SideMenu
      :items="menuItems"
      behavior="desktop"
      :width="240"
      :overlay="false"
      :pinned="true"
      @open="openPanel"
    />

    <!-- Content area driven by GoldenLayout -->
    <q-page-container>
      <q-page class="fit">
        <div id="golden-container" ref="glContainer" class="full-width full-height"></div>
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
/* Ensure GL container consumes all available height */
#golden-container {
  min-height: 100%;
}
</style>

