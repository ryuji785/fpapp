<template>
  <q-layout view="lHh Lpr lFf">
    <TopAppBar
      :is-drawer-open="drawerOpen"
      :username="username"
      @toggle-drawer="toggleDrawer"
    />

    <!-- Drawer: overlay under header -->
    <SideMenu
      v-model="drawerOpen"
      :items="menuItems"
    />

    <q-page-container>
      <q-page class="q-pa-md">
        <!-- show current view (your mock dashboard etc.) -->
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopAppBar from '../components/TopAppBar.vue'
import SideMenu from '../components/SideMenu.vue'
import { menuItems } from '../panels'

const username = 'User'

// Drawer closed on initial load
const drawerOpen = ref(false)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
</script>
