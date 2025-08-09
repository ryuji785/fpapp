import type { Component } from 'vue';

export interface PanelDefinition {
  title: string;
  componentName: string;
  loader: () => Promise<{ default: Component }>;
}

export const panelRegistry: Record<string, PanelDefinition> = {
  dashboard: {
    title: 'ダッシュボード',
    componentName: 'DashboardView',
    loader: () => import('./views/DashboardView.vue')
  },
  'data-entry': {
    title: 'Data Entry',
    componentName: 'DataEntryView',
    loader: () => import('./views/DataEntryView.vue')
  },
  'budget-settings': {
    title: 'Budget Settings',
    componentName: 'BudgetSettingsView',
    loader: () => import('./views/BudgetSettingsView.vue')
  },
  'asset-management': {
    title: 'Asset Management',
    componentName: 'AssetManagementView',
    loader: () => import('./views/AssetManagementView.vue')
  },
  'life-plan': {
    title: 'Life Plan Simulation',
    componentName: 'LifePlanSimulationView',
    loader: () => import('./views/LifePlanSimulationView.vue')
  },
  reports: {
    title: 'Reports',
    componentName: 'ReportsView',
    loader: () => import('./views/ReportsView.vue')
  },
  settings: {
    title: 'Settings',
    componentName: 'SettingsView',
    loader: () => import('./views/SettingsView.vue')
  }
};

export const menuItems = Object.entries(panelRegistry).map(([key, def]) => ({
  key,
  label: def.title
}));
