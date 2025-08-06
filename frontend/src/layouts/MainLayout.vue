<template>
  <q-layout view="hHh lpR fFf">
    <TopAppBar v-model:drawer="drawer" :username="username" />
    <SideMenu v-model="drawer" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TopAppBar from '../components/TopAppBar.vue';
import SideMenu from '../components/SideMenu.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { TopAppBar, SideMenu },
  setup() {
    const drawer = ref(false);
    const username = 'User';
    return { drawer, username };
  }
});
</script>
