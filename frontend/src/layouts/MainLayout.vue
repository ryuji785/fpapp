<template>
  <q-layout view="lHh Lpr lFf">
    <TopAppBar v-model:drawer="drawer" :username="username" />
    <SideMenu v-model="drawer" />
    <q-page-container>
      <q-page class="fit">
        <div id="golden-container" ref="glContainer" class="full-width full-height"></div>
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
