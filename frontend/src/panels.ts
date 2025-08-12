import type { Component } from 'vue';

export interface PanelDefinition {
  title: string;
  componentName: string;
  loader: () => Promise<{ default: Component }>;
}

export const panelRegistry: Record<string, PanelDefinition> = {
  // top
  cashflow: {
    title: 'キャッシュフロー',
    componentName: 'CashFlowPanel',
    loader: () => import('./components/CashFlowPanel.vue')
  },

  // left tabset
  'family-info': {
    title: '家族情報',
    componentName: 'FamilyInfoView',
    loader: () => import('./views/FamilyInfoView.vue')
  },
  'asset-management': {
    title: '資産情報',
    componentName: 'AssetManagementView',
    loader: () => import('./views/AssetManagementView.vue')
  },
  'life-plan': {
    title: 'ライフイベント',
    componentName: 'LifePlanSimulationView',
    loader: () => import('./views/LifePlanSimulationView.vue')
  },
  dashboard: {
    title: 'ダッシュボード',
    componentName: 'DashboardView',
    loader: () => import('./views/DashboardView.vue')
  },

  // right column
  'household-manager': {
    title: '家計管理',
    componentName: 'HouseholdManagerPanel',
    loader: () => import('./components/MonthlyGraph.vue')
  },
  'data-entry': {
    title: '家計入力',
    componentName: 'DataEntryView',
    loader: () => import('./views/DataEntryView.vue')
  },

  // optional extra menu
  reports: {
    title: 'レポート',
    componentName: 'ReportsView',
    loader: () => import('./views/ReportsView.vue')
  },
  settings: {
    title: '設定',
    componentName: 'SettingsView',
    loader: () => import('./views/SettingsView.vue')
  }
};

export const menuItems = Object.entries(panelRegistry).map(([key, def]) => ({
  key,
  label: def.title
}))

