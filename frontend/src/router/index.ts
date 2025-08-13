import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/app',
    component: MainLayout,
    children: [
      { path: 'dashboard', name: 'dashboard' },
      { path: 'data-entry', name: 'data-entry' },
      { path: 'list', name: 'list' },
      { path: 'future-cf', name: 'future-cf' },
      { path: 'life-events', name: 'life-events' },
      { path: 'settings', name: 'settings' },
      { path: '', redirect: { name: 'dashboard' } }
    ]
  },{
    path: '/:pathMatch(.*)*', redirect: '/app'
  }]
})
