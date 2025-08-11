<template>
  <q-drawer
    show-if-above
    :width="width"
    :overlay="overlay"
    bordered
  >
    <q-list>
      <q-item
        v-for="item in items"
        :key="item.key"
        clickable
        v-ripple
        active-class="bg-grey-3"
        @click="onClick(item.key, $event)"
      >
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
type MenuItem = { key: string; label: string };

const props = withDefaults(defineProps<{
  items: MenuItem[];
  width?: number;
  overlay?: boolean;
}>(), {
  width: 240,
  overlay: false
});

const emit = defineEmits<{ (e: 'open', key: string, newInstance?: boolean): void }>();

function onClick(key: string, evt: MouseEvent) {
  emit('open', key, evt.ctrlKey || evt.metaKey);
}
</script>

