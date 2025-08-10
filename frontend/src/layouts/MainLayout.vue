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
      @open="openPanel"
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

// When a menu item is clicked, on mobile we close the drawer.
// (SideMenu will already emit update on its own; this is just the action hook.)
function openPanel(key: string, _newInstance = false) {
  // optional: navigate or open GL panel here
  // this.$router.push(...) if using routes per menu
}
</script>
