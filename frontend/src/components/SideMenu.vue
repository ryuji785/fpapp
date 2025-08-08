<template>
  <q-drawer :model-value="modelValue" @update:model-value="update" show-if-above bordered overlay>
    <q-list>
      <q-item
        v-for="item in items"
        :key="item.key"
        clickable
        v-ripple
        active-class="bg-grey-3"
        @click="evt => handle(item.key, evt as MouseEvent)"
      >
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

type MenuItem = { key: string; label: string };
const props = defineProps<{ modelValue: boolean; items: MenuItem[] }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open', key: string, newInstance?: boolean): void;
}>();

const { modelValue, items } = toRefs(props);

function update(val: boolean) {
  emit('update:modelValue', val);
}

function handle(key: string, evt: MouseEvent) {
  emit('open', key, evt.metaKey || evt.ctrlKey);
  update(false);
}
</script>
