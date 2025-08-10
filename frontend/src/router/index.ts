import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
      {
        path: 'data-entry',
        name: 'data-entry',
        component: () => import('../views/DataEntryView.vue')
      },
      {
        path: 'budget-settings',
        name: 'budget-settings',
        component: () => import('../views/BudgetSettingsView.vue')
      },
      {
        path: 'asset-management',
        name: 'asset-management',
        component: () => import('../views/AssetManagementView.vue')
      },
      {
        path: 'life-plan',
        name: 'life-plan',
        component: () => import('../views/LifePlanSimulationView.vue')
      },
      { path: 'reports', name: 'reports', component: () => import('../views/ReportsView.vue') },
      { path: 'settings', name: 'settings', component: () => import('../views/SettingsView.vue') }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
