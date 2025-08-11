import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [{ path: '/', component: MainLayout }];

export default createRouter({ history: createWebHistory(), routes });

