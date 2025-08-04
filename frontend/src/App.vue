<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-center">FPApp</q-toolbar-title>
        <q-btn flat dense round icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple :active="currentPage === 'dashboard'" @click="goTo('dashboard')">
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="currentPage === 'data-entry'" @click="goTo('data-entry')">
          <q-item-section>Data Entry</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition name="fade" mode="out-in">
        <component :is="currentComponent" />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardPage from './pages/DashboardPage.vue';
import DataEntryPage from './pages/DataEntryPage.vue';

const leftDrawerOpen = ref(false);
const currentPage = ref<'dashboard' | 'data-entry'>('dashboard');
const components = {
  dashboard: DashboardPage,
  'data-entry': DataEntryPage,
};
const currentComponent = computed(() => components[currentPage.value]);

function goTo(page: 'dashboard' | 'data-entry') {
  currentPage.value = page;
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
