<template>
<q-drawer show-if-above :width="180" bordered :overlay="false">
  <q-list>
    <q-item v-for="item in items" :key="item.key"
            clickable v-ripple active-class="bg-grey-3"
            @click="emit('open', item.key, $event.ctrlKey || $event.metaKey)">
      <q-item-section>{{ item.label }}</q-item-section>
    </q-item>
  </q-list>
</q-drawer>
</template>

<script setup lang="ts">
type MenuItem = { key: string; label: string };

const props = defineProps<{ items: MenuItem[] }>();

const emit = defineEmits<{ (e: 'open', key: string, newInstance?: boolean): void }>();
</script>

