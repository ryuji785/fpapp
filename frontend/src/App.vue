<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green-7 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title class="text-center">FPApp</q-toolbar-title>
        <q-btn flat dense round icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered>
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
      <div ref="layoutEl" class="layout"></div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, createApp } from 'vue';
import { GoldenLayout, type LayoutConfig } from 'golden-layout';
import CashFlowPanel from './components/CashFlowPanel.vue';
import ExpenseInput from './components/ExpenseInput.vue';

interface GLContainer { element: HTMLElement; }
type GLComponentConstructor = (container: GLContainer, state?: unknown) => void;

const drawer = ref(true);
const currentView = ref<'dashboard' | 'data-entry'>('dashboard');
const layoutEl = ref<HTMLDivElement | null>(null);
let layout: GoldenLayout | null = null;

function createConfig(view: 'dashboard' | 'data-entry'): LayoutConfig {
  return {
    root: {
      type: 'row',
      content: [
        { type: 'component', componentType: view, title: view === 'dashboard' ? 'Dashboard' : 'Data Entry' }
      ]
    }
  };
}

onMounted(() => {
  if (!layoutEl.value) return;
  const gl = new GoldenLayout(createConfig(currentView.value), layoutEl.value) as any;

  const dashboardCtor: GLComponentConstructor = container => {
    const el = document.createElement('div');
    container.element.append(el);
    createApp(CashFlowPanel).mount(el);
  };

  const dataEntryCtor: GLComponentConstructor = container => {
    const el = document.createElement('div');
    container.element.append(el);
    createApp(ExpenseInput).mount(el);
  };

  gl.registerComponentConstructor('dashboard', dashboardCtor as any);
  gl.registerComponentConstructor('data-entry', dataEntryCtor as any);
  gl.init();
  layout = gl;
  updateLayoutSize();
});

function updateLayoutSize() {
  if (layout && layoutEl.value) {
    layout.updateSize(layoutEl.value.clientWidth, layoutEl.value.clientHeight);
  }
}

function switchView(view: 'dashboard' | 'data-entry') {
  currentView.value = view;
  layout?.loadLayout(createConfig(view));
  updateLayoutSize();
}

watch(drawer, updateLayoutSize);
</script>

<style>
.layout {
  width: 100%;
  height: 100%;
}
</style>
