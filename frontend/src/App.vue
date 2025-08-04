<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-green-7 text-white">
      <q-toolbar>
        <q-btn flat dense round :icon="drawer ? 'close' : 'menu'" @click="drawer = !drawer" />
        <q-toolbar-title class="text-center">FPApp</q-toolbar-title>
        <q-btn flat dense round icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered overlay>
      <q-list>
        <q-item clickable v-ripple active-class="bg-grey-3" :active="currentView === 'dashboard'" @click="switchView('dashboard')">
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable v-ripple active-class="bg-grey-3" :active="currentView === 'data-entry'" @click="switchView('data-entry')">
          <q-item-section>Data Entry</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <component :is="currentComponent" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardView from './components/DashboardView.vue';
import DataEntryView from './components/DataEntryView.vue';

const drawer = ref(false);
const currentView = ref<'dashboard' | 'data-entry'>('dashboard');

const componentMap = {
  dashboard: DashboardView,
  'data-entry': DataEntryView
} as const;

const currentComponent = computed(() => componentMap[currentView.value]);

function switchView(view: 'dashboard' | 'data-entry') {
  currentView.value = view;
}
</script>
