<template>
  <div class="q-pa-md column q-gutter-md">
    <q-form class="row q-col-gutter-md items-end">
      <q-input v-model="event.name" label="イベント" class="col" />
      <q-input v-model="event.date" type="date" label="日付" class="col" />
      <q-btn label="追加" color="primary" @click="addEvent" class="col-auto" />
    </q-form>
    <q-timeline>
      <q-timeline-entry v-for="e in events" :key="e.id" :title="e.name" :subtitle="e.date" />
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let id = 2
const event = ref({ name: '', date: '' })
const events = ref([
  { id: 1, name: '結婚', date: '2025-06-01' }
])
function addEvent() {
  if (!event.value.name) return
  events.value.push({ id: id++, name: event.value.name, date: event.value.date })
  event.value = { name: '', date: '' }
}
</script>
