<template>
  <q-drawer
    v-model="model"
    show-if-above
    behavior="desktop"
    :breakpoint="1024"
    bordered
    :width="260"
  >
    <q-list>
      <q-item
        v-for="item in items"
        :key="item.key"
        clickable
        v-ripple
        active-class="bg-grey-3"
        @click="onItemClick(item.key, $event)"
      >
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import { useQuasar } from 'quasar';

type MenuItem = { key: string; label: string };

const props = defineProps<{ modelValue: boolean; items: MenuItem[] }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'open', key: string, newInstance?: boolean): void;
}>();

const { modelValue, items } = toRefs(props);
const $q = useQuasar();

const model = computed({
  get: () => modelValue.value,
  set: (v: boolean) => emit('update:modelValue', v),
});

function onItemClick(key: string, evt: MouseEvent) {
  emit('open', key, evt.metaKey || evt.ctrlKey);
  // Close only on mobile (overlay mode)
  if ($q.screen.lt.lg) {
    model.value = false;
  }
}
</script>
