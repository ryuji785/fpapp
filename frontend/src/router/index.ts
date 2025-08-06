import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import DashboardView from '../views/DashboardView.vue';
import DataEntryView from '../views/DataEntryView.vue';
import BudgetSettingsView from '../views/BudgetSettingsView.vue';
import AssetManagementView from '../views/AssetManagementView.vue';
import LifePlanSimulationView from '../views/LifePlanSimulationView.vue';
import ReportsView from '../views/ReportsView.vue';
import SettingsView from '../views/SettingsView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: DashboardView },
      { path: 'data-entry', name: 'Data Entry', component: DataEntryView },
      { path: 'budget-settings', name: 'Budget Settings', component: BudgetSettingsView },
      { path: 'asset-management', name: 'Asset Management', component: AssetManagementView },
      { path: 'life-plan', name: 'Life Plan Simulation', component: LifePlanSimulationView },
      { path: 'reports', name: 'Reports', component: ReportsView },
      { path: 'settings', name: 'Settings', component: SettingsView }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
