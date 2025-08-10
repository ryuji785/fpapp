<template>
  <q-header elevated class="bg-green-7 text-white">
    <q-toolbar>
      <q-btn flat dense round @click="$emit('toggle-drawer')">
        <transition name="rotate" mode="out-in">
          <q-icon :key="isDrawerOpen ? 'close' : 'menu'" :name="isDrawerOpen ? 'close' : 'menu'" />
        </transition>
      </q-btn>

      <q-toolbar-title class="text-center">FPApp</q-toolbar-title>

      <div class="row items-center no-wrap q-gutter-sm">
        <q-icon name="account_circle" />
        <div class="column items-end">
          <div>User: {{ username }}</div>
          <div>{{ now }}</div>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ isDrawerOpen: boolean; username: string }>()
defineEmits<{ (e: 'toggle-drawer'): void }>()

const now = ref('')
let timer: number

function tick() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  now.value = `${y}/${m}/${day} ${hh}:${mm}`
}

onMounted(() => {
  tick()
  timer = window.setInterval(tick, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.rotate-enter-active, .rotate-leave-active { transition: transform .2s ease; }
.rotate-enter-from, .rotate-leave-to { transform: rotate(180deg); }
</style>
