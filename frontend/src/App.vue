<template>
  <div class="app">
    <header class="header">
      <span class="hamburger" @click="toggleSidebar">&#9776;</span>
      <span class="title">FPApp</span>
      <span class="user">&#128100;</span>
    </header>
    <div class="body">
      <aside v-show="sidebarOpen" class="sidebar">
        <ul>
          <li :class="{ active: currentView === 'dashboard' }" @click="switchView('dashboard')">Dashboard</li>
          <li :class="{ active: currentView === 'data-entry' }" @click="switchView('data-entry')">Data Entry</li>
        </ul>
      </aside>
      <main class="main">
        <div ref="layoutEl" class="layout"></div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, createApp } from 'vue';
import { GoldenLayout, type LayoutConfig } from 'golden-layout';
import CashFlowPanel from './components/CashFlowPanel.vue';
import ExpenseInput from './components/ExpenseInput.vue';

interface GLContainer {
  element: HTMLElement;
}

type GLComponentConstructor = (container: GLContainer, state?: unknown) => void;

const layoutEl = ref<HTMLDivElement | null>(null);
const sidebarOpen = ref(true);
const currentView = ref<'dashboard' | 'data-entry'>('dashboard');
let layout: GoldenLayout | null = null;

function createConfig(view: 'dashboard' | 'data-entry'): LayoutConfig {
  return {
    root: {
      type: 'row',
      content: [
        {
          type: 'component',
          componentType: view,
          title: view === 'dashboard' ? 'Dashboard' : 'Data Entry'
        }
      ]
    }
  };
}

onMounted(() => {
  if (!layoutEl.value) return;

  layout = new GoldenLayout(createConfig(currentView.value), layoutEl.value) as any;

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

  layout.registerComponentConstructor('dashboard', dashboardCtor as any);
  layout.registerComponentConstructor('data-entry', dataEntryCtor as any);
  layout.init();
});

function switchView(view: 'dashboard' | 'data-entry') {
  currentView.value = view;
  layout?.loadLayout(createConfig(view));
  layout?.updateSize();
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
  layout?.updateSize();
}

watch(sidebarOpen, () => {
  layout?.updateSize();
});
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.header {
  height: 50px;
  background-color: #2e7d32;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.hamburger {
  cursor: pointer;
}

.body {
  flex: 1;
  display: flex;
  height: calc(100vh - 50px);
}

.sidebar {
  width: 200px;
  background: #f0f0f0;
  padding-top: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.sidebar li.active {
  background: #ddd;
}

.main {
  flex: 1;
}

.layout {
  width: 100%;
  height: 100%;
}
</style>
