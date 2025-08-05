<template>
  <q-layout view="hHh lpR fFf">
    <AppHeader v-model:drawer="drawer" />

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
import AppHeader from './components/AppHeader.vue';
import Dashboard from './components/Dashboard.vue';
import DataEntry from './components/DataEntry.vue';

const drawer = ref(false);
const currentView = ref<'dashboard' | 'data-entry'>('dashboard');

const componentMap = {
  dashboard: Dashboard,
  'data-entry': DataEntry
} as const;

const currentComponent = computed(() => componentMap[currentView.value]);

function switchView(view: 'dashboard' | 'data-entry') {
  currentView.value = view;
  drawer.value = false;
}
</script>

