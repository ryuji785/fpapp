<template>
  <q-layout view="lHh Lpr lff">
    <TopAppBar @toggle-drawer="drawer = !drawer" />
    <SideMenu v-model="drawer" />
    <q-page-container>
      <MainLayout />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TopAppBar from '@/components/TopAppBar.vue';
import SideMenu from '@/components/SideMenu.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const drawer = ref(false);
</script>
