<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-green-7 text-white">
      <TopAppBar :is-drawer-open="drawerOpen" :username="username"
                 @toggle-drawer="toggleDrawer" />
    </q-header>

    <SideMenu v-model="drawerOpen" :items="menuItems" @navigate="handleNavigate" />

    <q-page-container>
      <q-page class="fit">
        <div id="gl-root" ref="glRoot" class="fit" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import TopAppBar from '@/components/TopAppBar.vue'
import SideMenu from '@/components/SideMenu.vue'
import { useGLStore } from '@/stores/useGLStore'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const username = 'User'
const drawerOpen = ref($q.screen.gt.md)
const glRoot = ref<HTMLDivElement>()
const menuItems = [
  { key:'dashboard',    label:'ダッシュボード' },
  { key:'data-entry',   label:'データ入力' },
  { key:'list',         label:'一覧' },
  { key:'future-cf',    label:'将来CF' },
  { key:'life-events',  label:'ライフイベント' },
  { key:'settings',     label:'設定' },
]

const gl = useGLStore()

onMounted(() => {
  if (glRoot.value) {
    gl.mount(glRoot.value)
    if (!gl.restore()) gl.openOrActivatePanel('dashboard')
  }
  handleNavigate((route.name as string) || 'dashboard', false)
  watch(() => route.name, (name) => handleNavigate((name as string) || 'dashboard', false))
})

function toggleDrawer() { drawerOpen.value = !drawerOpen.value }
function handleNavigate(name: string, pushRoute = true) {
  if (pushRoute) router.push({ name })
  gl.openOrActivatePanel(name)
  if (!$q.screen.gt.md) drawerOpen.value = false
}
</script>
