<template>
  <q-toolbar>
    <q-btn flat round dense icon="menu" v-if="!isDrawerOpen" @click="emit('toggle-drawer')" />
    <q-btn flat round dense icon="close" v-else @click="emit('toggle-drawer')" />
    <q-toolbar-title>FPApp</q-toolbar-title>
    <div class="row items-center q-gutter-sm">
      <q-icon name="account_circle" size="md" />
      <span>{{ username }}</span>
      <span>{{ time }}</span>
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps<{ isDrawerOpen: boolean, username: string }>()
const emit = defineEmits<{ (e:'toggle-drawer'): void }>()
const time = ref('')
let timer: number
function update() { time.value = new Date().toLocaleString() }
onMounted(() => { update(); timer = window.setInterval(update, 1000) })
onBeforeUnmount(() => window.clearInterval(timer))
</script>
