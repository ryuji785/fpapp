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
import { useRouter } from 'vue-router'
import TopAppBar from '../components/TopAppBar.vue'
import SideMenu from '../components/SideMenu.vue'
import { menuItems } from '../panels'

const username = 'User'
const router = useRouter()

// Drawer closed on initial load
const drawerOpen = ref(false)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function openPanel(key: string) {
  router.push({ name: key })
}
</script>
