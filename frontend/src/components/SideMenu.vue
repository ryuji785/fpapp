<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="update"
    bordered
    behavior="mobile"
    overlay
    :width="220"
  >
    <q-list>
      <q-item
        v-for="item in items"
        :key="item.key"
        tag="router-link"
        :to="{ name: item.key }"
        clickable
        v-ripple
        active-class="bg-grey-3"
        @click="onNavigate"
      >
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useQuasar } from 'quasar'

type MenuItem = { key: string; label: string }
const props = defineProps<{ modelValue: boolean; items: MenuItem[] }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { modelValue, items } = toRefs(props)
const $q = useQuasar()

function update(val: boolean) {
  emit('update:modelValue', val)
}

function onNavigate() {
  // close ONLY on mobile overlay
  if (!$q.screen.gt.sm) update(false)
}
</script>
