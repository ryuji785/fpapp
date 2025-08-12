<template>
  <q-drawer :model-value="modelValue" @update:model-value="update" show-if-above bordered overlay>
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
import { toRefs } from 'vue'
type MenuItem = { key: string; label: string }

const props = defineProps<{ modelValue: boolean; items: MenuItem[] }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'open', key: string, newInstance?: boolean): void
}>()

const { modelValue, items } = toRefs(props)

function update (val: boolean) {
  emit('update:modelValue', val)
}

function onItemClick (key: string, evt: Event) {
  const newInstance = (evt as MouseEvent).metaKey || (evt as MouseEvent).ctrlKey
  emit('open', key, newInstance)
  update(false)
}
</script>

