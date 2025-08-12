<template>
  <q-header elevated class="bg-green-7 text-white">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        :icon="isDrawerOpen ? 'close' : 'menu'"
        @click="emit('toggle-drawer')"
      />
      <q-toolbar-title class="text-center">FPApp</q-toolbar-title>
      <div class="row items-center no-wrap q-gutter-sm">
        <q-icon name="account_circle" />
        <div class="column items-end">
          <div>ユーザー: {{ username }}</div>
          <div>{{ now }}</div>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ username: string; isDrawerOpen: boolean }>()
const emit = defineEmits<{ (e: 'toggle-drawer'): void }>()
const now = ref('')

let timer: number;
function tick() {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  now.value = `${yy}/${mm}/${dd} ${h}:${m}:${s}`;
}

onMounted(() => {
  tick()
  timer = window.setInterval(tick, 1000)
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>

