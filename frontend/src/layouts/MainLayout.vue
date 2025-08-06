<template>
  <q-layout view="hHh lpR fFf">
    <TopAppBar v-model:drawer="drawer" :username="username" />
    <SideMenu v-model="drawer" />
    <q-page-container>
      <q-page class="fit">
        <div ref="glContainer" class="fit"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TopAppBar from '../components/TopAppBar.vue';
import SideMenu from '../components/SideMenu.vue';
import { provideGoldenLayout } from '../composables/useGoldenLayout';

export default defineComponent({
  name: 'MainLayout',
  components: { TopAppBar, SideMenu },
  setup() {
    const drawer = ref(false);
    const username = 'User';
    const { container: glContainer } = provideGoldenLayout('dashboard');
    return { drawer, username, glContainer };
  }
});
</script>
