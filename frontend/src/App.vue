<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-green-7 text-white">
      <q-toolbar>
        <q-btn flat dense round @click="drawer = !drawer">
          <transition name="rotate" mode="out-in">
            <q-icon :key="drawer" :name="drawer ? 'close' : 'menu'" />
          </transition>
        </q-btn>
        <q-toolbar-title class="text-center">FPApp</q-toolbar-title>
        <div class="row items-center no-wrap q-gutter-sm">
          <q-icon name="account_circle" />
          <div class="column items-end">
            <div>User: ryuji</div>
            <div>{{ currentTime }}</div>
          </div>
        </div>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
  drawer.value = false;
}

const currentTime = ref('');
let timer: number;

function updateTime() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const h = String(now.getUTCHours()).padStart(2, '0');
  const min = String(now.getUTCMinutes()).padStart(2, '0');
  currentTime.value = `${y}/${m}/${d} ${h}:${min}`;
}

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
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
